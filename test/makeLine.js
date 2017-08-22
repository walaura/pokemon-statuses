const makeLine = require('../src/lib/makeLine');

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
