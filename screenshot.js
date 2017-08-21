const fs = require('fs');
const puppeteer = require('puppeteer');
const sharp = require('sharp');
const makeLine = require('./lib/makeLine');

const width = 140;
const height = 150;
const output = [0,1];

(async () => {

    const line = await makeLine();

    console.log(line);

    const tpl = fs.readFileSync(__dirname+'/asset/index.tpl.html')
        .toString()
        .replace('{text.1}',line.text[0])
        .replace('{text.2}',line.text[1])
        .replace(/{img}/g,line.image);

    fs.writeFileSync(__dirname+'/output/index.html',tpl);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('file://'+__dirname+'/output/index.html');
    await page.setViewport({width:width,height:height*output.length});
    await Promise.all(output.map(make=>{

        const filename = `output/${make}.png`;
        const filenameSharp = `output/${make}-sharp.png`;

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

    }))

    browser.close();
})();
