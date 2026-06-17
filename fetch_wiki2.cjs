const https = require('https');
const locations = ['Turkey', 'Mecca'];

async function fetchWikiImage(title) {
  return new Promise((resolve) => {
    https.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
      headers: { 'User-Agent': 'TravelAgencyApp/1.0 (test@example.com)' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data).thumbnail.source); } catch(e) { resolve(''); }
      });
    }).on('error', () => resolve(''));
  });
}

(async () => {
  for (const loc of locations) {
    const img = await fetchWikiImage(loc);
    console.log(loc + '|' + img);
  }
})();
