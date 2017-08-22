const path = require('path');
const config = {};

config.path = {
	corpus: path.join(__dirname,'/../asset/corpus'),
	html: path.join(__dirname,'/../asset'),
	sprite: path.join(__dirname,'/../asset/sprite'),
	output: path.join(__dirname,'/../output'),
};

config.target = {
	htmlTemplate : path.resolve(config.path.html,'index.tpl.html'),
	html: path.resolve(config.path.output,'index.html'),
};

module.exports = config;
