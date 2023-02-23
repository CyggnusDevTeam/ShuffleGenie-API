const axios = require('axios');
const cheerio = require('cheerio');
const { json } = require('express');
const express = require('express');
const DATA_DOMAIN = 'https://marvelsnapzone.com/users/';

// Set up the express server
const app = express();
app.use(json());
const port = 3001;

app.get('/user/:user', async (req, res) => {
  try {
    const { user } = req.params;
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

    res.json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Failed to retrieve user collection - ${error}`);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
