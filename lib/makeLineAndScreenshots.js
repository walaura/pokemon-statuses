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
	console.error(err);
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
	await page.setViewport({width:width,height:height*output.length});

	return await Promise.all(output.map(make=>{

		const filename = `${__dirname}/../output/${make}.png`;
		const filenameSharp = `${__dirname}/../output/${make}-sharp.png`;

		return page.screenshot({
			path: filename,
			clip: {
				x: 0,
				y: height*make,
				width: width,
				height: height,
			}
		}).then(()=>(
			sharp(filename)
				.resize(width*10,height*10,{
					interpolator: sharp.interpolator.nearest
				})
				.toFile(filenameSharp)
		));

	})).then(()=>{

		browser.close();
		
		return {
			lines: line,
			files: output.map(make=>`${__dirname}/../output/${make}-sharp.png`)
		};
	});

};
