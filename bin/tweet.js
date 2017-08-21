/*eslint no-console:0 */

require('dotenv').config();

const makeLineAndScreenshots = require('./../lib/makeLineAndScreenshots');
const twitter = require('twitter');
const chalk = require('chalk');
const fs = require('fs');

const client = new twitter({
	consumer_key: process.env.TWITTER_CK,
	consumer_secret: process.env.TWITTER_CS,
	access_token_key: process.env.TWITTER_TK,
	access_token_secret: process.env.TWITTER_TS
});

(async () => {

    const data = await makeLineAndScreenshots();

    await Promise.all(data.files.map(screenshot => (
        client.post('media/upload', {media: fs.readFileSync(screenshot)})
    ))).then(screenshots => (
        client.post('statuses/update', {
            media_ids: screenshots.map(screenshot=>screenshot.media_id_string).join(','),
            status: data.lines.text[0],
        })
    )).then(tweet=>{
        console.info(chalk.green(`✔ Posted: ${data.lines.text[0]}`));
        console.info(data);
    }).catch(error => {
        console.error(chalk.red('✘ Post failed'));
        console.error(error);
    })

})();
