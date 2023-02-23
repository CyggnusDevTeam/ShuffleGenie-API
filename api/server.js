const functions = require('@google-cloud/functions-framework');
const axios = require('axios');
const cheerio = require('cheerio');

functions.http('getCollection', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');

  if (req.method === 'OPTIONS') {
    // stop preflight requests here
    res.status(204).send('Invalid request');
    return;
  }

  const { user } = req.query;
  if (!user) res.status(422).send('Missing params!');
  try {
    const DATA_DOMAIN = 'ENDPOINT GOES HERE';
    // Request user profile
    const { data: html } = await axios.get(`${DATA_DOMAIN}${user}`);

    // Parse html
    const $ = cheerio.load(html);

    // Filter user cards
    const cards = [];
    $('#collection .card-collection').each((_, card) => {
      const id = $(card).attr('data-cid');
      const name = $(card).find('.name').text();
      const imgUrl = $(card).find('img').attr('data-src');

      cards.push({ id, name, imgUrl });
    });

    // Respond with cards array
    res.json(cards);
  } catch (error) {
    res.status(500).send(`Failed to retrieve user collection - ${error}`);
  }
});
