const chai = require('chai');
const makeLine = require('./../lib/makeLine.js');

describe('Basic', function() {

	it('should make a line',(done)=>{

		try {
			const line = await makeLine();
			done()
		} catch (err) {
			done(err);
		}

	});

});
