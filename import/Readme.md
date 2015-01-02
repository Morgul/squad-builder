# Import data

This is a little script for importing initial data from [geordanr/xwing](https://github.com/geordanr/xwing), who has
graciously MIT licensed his code. As this is the only opensource repository of this card data that I have found to date,
this seemed like the most reasonable way to get my initial data.

I'm keeping this script around in case I either need to perform updates, or to help anyone else who wants to use his
data as opposed to my modified version. (Also, it took about a day to write, and I like preserving my work.)

## Usage

You will need to download [xwing/javascripts/cards-common.js](https://github.com/geordanr/xwing/raw/master/javascripts/cards-common.js),
[xwing/javascripts/manifest.js](https://github.com/geordanr/xwing/raw/master/javascripts/manifest.js), and
[xwing/javascripts/cards-en.js](https://github.com/geordanr/xwing/raw/master/javascripts/cards-en.js) from his
repository, into the `import` directory.

Once you do that, simply run `node ./import_cards.js` from the `import` directory.