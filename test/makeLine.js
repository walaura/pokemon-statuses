const chai = require('chai');
const makeLine = require('./../lib/makeLine.js');

describe('Basic', function() {

	it('should make a line',(done)=>{

		try {
			makeLine().then(line=>{
				done()
			})
		} catch (err) {
			done(err);
		}

	});

});
