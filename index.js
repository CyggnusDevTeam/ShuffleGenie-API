const functions = require('@google-cloud/functions-framework');
const axios = require('axios');
const cheerio = require('cheerio');

functions.http('fetchData', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');

  const DATA_DOMAIN = 'ENDPOINT URL FOR DATA COLLECTION GOES HERE';

  if (req.method === 'OPTIONS') {
    // stop preflight requests here
    res.status(204).send('Invalid request');
    return;
  }

  const { user } = req.query;
  if (!user) {
    res.status(422).send('API Error: Missing params!');
    return;
  }

  if (user) {
    try {
      const { data: html } = await axios.get(`${DATA_DOMAIN}users/${user}`);
      const $ = cheerio.load(html);

      const cards = [];
      $('#collection .card-collection').each((_, card) => {
        const id = $(card).attr('data-cid');
        const name = $(card).find('.name').text();
        const imgUrl = $(card).find('img').attr('data-src');

        cards.push({ id, name, imgUrl });
      });

      res.json(cards);
    } catch (error) {
      res.status(500).send(`Failed to retrieve user collection - ${error}`);
    }
  } else {
    res.status(422).send('Invalid query parameter!');
  }
});
