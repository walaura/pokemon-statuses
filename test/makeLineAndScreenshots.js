const makeLineAndScreenshots = require('../src/lib/makeLineAndScreenshots');
const config = require('../src/config');

const rmdir = require('rimraf');
const fs = require('fs');
const chai = require('chai');

describe('Basic', function() {

	before(done => {
		rmdir(config.path.output,()=>done());
	})

	it('should make a line and screenshots',(done)=>{

		try {
			makeLineAndScreenshots().then(data=>{
				chai.expect(data.files.length).to.equal(fs.readdirSync(config.path.output).length-1);
				done();
			});
		} catch (err) {
			done(err);
		}

	}).timeout(50000);

});
