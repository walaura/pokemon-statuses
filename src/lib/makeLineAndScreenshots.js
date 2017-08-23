const path = require('path');
const puppeteer = require('puppeteer');
const makeLine = require('./makeLine');
const makeHtml = require('./makeHtml');
const config = require('../config');

const width = 140;
const height = 150;
const output = [0,1];


module.exports = async () => {

	try {

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
		await page.goto(
			'file://'+config.target.html,
			{
				waitUntil: 'networkidle'
			}
		);

		const filenames = await Promise.all(output.map(make=>{
			const filename = path.resolve(config.path.output,`${make}.png`);
			await page.screenshot({
				path: filename,
				fullPage: false,
				type: 'png',
				clip: {
					x: 0,
					y: height*make,
					width: width,
					height: height,
				},
			})
			return filename;

		}));

		browser.close();

		return {
			lines: line,
			files: filenames
		};

	} catch (err) {

		return Promise.reject(err);

	}

};
