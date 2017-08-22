const fs = require('fs');
const random = require('random-item-in-array');

const assets = {
    dialog : fs.readdirSync(__dirname+'/../asset/sprites').filter(name=>name.indexOf('dialog')===0),
    plate : fs.readdirSync(__dirname+'/../asset/sprites').filter(name=>name.indexOf('plate')===0),
}

module.exports = async line => {

	try {
		fs.mkdirSync(__dirname+'/../output');
	} catch(err){
		if(err.message.indexOf('EEXIST') !== 0) {
			throw err;
		}
	}

	const body = line.text.reduce((acc,text)=>(
		acc + `
		<box>
		    <img src='${line.image}'/>
		    <text>${text}</text>
		</box>
		`
	),'');

	const tpl = fs.readFileSync(__dirname+'/../asset/index.tpl.html')
		.toString()
		.replace('{body}',body)
        .replace('{css}',
            Object.keys(assets).map(asset=>(
                `--url-${asset}: url(./../asset/sprites/${random(assets.asset)})`
            )).join(';\n')
        );

	fs.writeFileSync(__dirname+'/../output/index.html',tpl);

    return Promise.resolve(true);

}
