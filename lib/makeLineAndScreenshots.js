const fs = require('fs');
const puppeteer = require('puppeteer');
const sharp = require('sharp');
const makeLine = require('./makeLine');

const width = 140;
const height = 150;
const output = [0,1];

try {
	fs.mkdirSync(__dirname+'/../output');
} catch(err){
	if(err.message.indexOf('EEXIST') !== 0) {
		throw err;
	}
}

module.exports = async () => {

	const line = await makeLine();

	const tpl = fs.readFileSync(__dirname+'/../asset/index.tpl.html')
		.toString()
		.replace('{text.1}',line.text[0])
		.replace('{text.2}',line.text[1])
		.replace(/{img}/g,line.image);

	fs.writeFileSync(__dirname+'/../output/index.html',tpl);

	const browser = await puppeteer.launch({
		args: ['--no-sandbox']
	});
	const page = await browser.newPage();
	await page.goto('file://'+__dirname+'/../output/index.html');
	await page.setViewport({
		width:width,
		height:height*output.length,
		deviceScaleFactor: 10,
	});

	return await Promise.all(output.map(make=>{

		const filename = `${__dirname}/../output/${make}.png`;

		return page.screenshot({
			path: filename,
			clip: {
				x: 0,
				y: height*make,
				width: width,
				height: height,
			}
		});

	})).then(()=>{

		browser.close();

		return {
			lines: line,
			files: output.map(make=>`${__dirname}/../output/${make}.png`)
		};
	});

};
