const random = require('random-item-in-array');
const conjugate = require('conjugate');
const fs = require('fs');
const scraperjs = require('scraperjs');

const pkmn = fs.readFileSync(__dirname+'/../corpus/pkmn.txt').toString().split('\n').map(str=>str.trim());
const adj = fs.readFileSync(__dirname+'/../corpus/adj.txt').toString().split('\n').map(str=>str.trim());
const verbs = fs.readFileSync(__dirname+'/../corpus/verbs.txt').toString().split('\n').map(str=>str.trim());

const pronoun = random([
    ['she','her','herself'],
    ['it','its','itself'],
    ['they','their','themself'],
    ['he','his','himself'],
]);

module.exports = () => {
    const props = {};

    props.pkmn = random(pkmn)
    props.adj = random(adj);
    props.verb = conjugate(pronoun[0],random(verbs));

    props.adjAsNoun = props.adj.substr(-2) === 'ed'? props.adj.substr(0,props.adj.length-2)+'ion' : props.adj+'ness';

    return scraperjs.StaticScraper.create(`https://bulbapedia.bulbagarden.net/wiki/${props.pkmn}_(Pokémon)`)
		.scrape($ => (
			'http://'+$('.roundy[style="background:#FFF;"] img')[0].attribs.src
		))
		.then(image => (
            {
                image: image,
                text: [
                    `${props.pkmn.toUpperCase()} is ${props.adj}!`,
                    `${pronoun[0]} ${props.verb} ${pronoun[2]} in ${pronoun[1]} ${props.adjAsNoun}!`
                ],
                props: props,
            }
        ))
}
