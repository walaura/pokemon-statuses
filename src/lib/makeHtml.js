const config = require('../config');
const fs = require('fs');
const random = require('random-item-in-array');
const path = require('path');

const assets = {
	dialog : fs.readdirSync(config.path.sprite).filter(name=>name.indexOf('dialog')===0),
	plate : fs.readdirSync(config.path.sprite).filter(name=>name.indexOf('plate')===0),
	bg : fs.readdirSync(config.path.sprite).filter(name=>name.indexOf('bg')===0),
};

module.exports = async line => {

	try {
		fs.mkdirSync(config.path.output);
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

	const tpl = fs.readFileSync(config.target.htmlTemplate)
		.toString()
		.replace('{body}',body)
		.replace('{css}',
			Object.keys(assets).map(asset=>(
				`--url-${asset}: url(${path.resolve(config.path.sprite,random(assets[asset]))})`
			)).join(';\n')
		);

	fs.writeFileSync(config.target.html,tpl);

	return Promise.resolve(true);

};
