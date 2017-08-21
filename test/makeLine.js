const makeLine = require('./../lib/makeLine.js');

describe('Basic', function() {

	it('should make a line',(done)=>{

		try {
			makeLine().then(()=>{
				done();
			});
		} catch (err) {
			done(err);
		}

	});

});
