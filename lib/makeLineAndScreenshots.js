const fs = require('fs');
const puppeteer = require('puppeteer');
const makeLine = require('./makeLine');
const makeHtml = require('./makeHtml');

const width = 140;
const height = 150;
const output = [0,1];


module.exports = async () => {

	const [browser, line] = await Promise.all([
		puppeteer.launch({
			args: ['--no-sandbox']
		}),
		makeLine()
	]);

	await makeHtml(line);

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
