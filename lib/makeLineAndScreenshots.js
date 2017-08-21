const fs = require('fs');
const puppeteer = require('puppeteer');
const makeLine = require('./makeLine');

const width = 140;
const height = 150;
const output = [0,1];

const makeHtml = line => {

	try {
		fs.mkdirSync(__dirname+'/../output');
	} catch(err){
		if(err.message.indexOf('EEXIST') !== 0) {
			throw err;
		}
	}
	const tpl = fs.readFileSync(__dirname+'/../asset/index.tpl.html')
		.toString()
		.replace('{text.1}',line.text[0])
		.replace('{text.2}',line.text[1])
		.replace(/{img}/g,line.image);

	fs.writeFileSync(__dirname+'/../output/index.html',tpl);

	return true;

}

module.exports = async () => {

	const [browser, line] = await Promise.all([
		puppeteer.launch({
			args: ['--no-sandbox']
		}),
		makeLine()
	]);

	makeHtml(line);

	const page = await browser.newPage();

	await page.setViewport({
		width:width,
		height:height*output.length,
		deviceScaleFactor: 10,
	});
	await page.goto('file://'+__dirname+'/../output/index.html');

	const filenames = await Promise.all(output.map(make=>{
		const filename = `${__dirname}/../output/${make}.png`;
		return page.screenshot({
			path: filename,
			clip: {
				x: 0,
				y: height*make,
				width: width,
				height: height,
			}
		}).then(()=>filename)

	}));

	browser.close();

	return {
		lines: line,
		files: filenames
	};

};
