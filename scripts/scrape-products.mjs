import https from 'https';
import fs from 'fs';
import path from 'path';

const products = [
  'kacper_3d', 'kacper_2d', 'prostokat_fornir_3dn9', 'prostokat_plyta_3dn9', 'prostokat_fornir_4dn9',
  'prostokat_n9', 'prostokat_l_prosta', 'kolo_l_diament', 'owal_l_diament', 'owal_fornir_diament',
  'owal_plyta_ludwik', 'owal_fornir_ludwik_cienki', 'owal_4dn9_diament', 'ludwik_ostry', 'minimax',
  'beczka', 'kaczka', 'pajak', 'rama_prostokat', 'krzyz', 'x', 'y',
];

const folderMap = { x: 'Nowy folder (2)', y: 'Nowy folder' };

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

const result = {};

for (const slug of products) {
  const folder = folderMap[slug] || slug;
  const url = `https://stoly.rzeszow.pl/oferta/stoly/${encodeURIComponent(folder)}/stol1.html`;
  try {
    const html = await fetch(url);
    const titleMatch = html.match(/<h1>([^<]+)<\/h1>/);
    const descMatch = html.match(/<div class="opis">\s*<p>([\s\S]*?)<\/p>/);
    result[slug] = {
      title: titleMatch ? titleMatch[1].trim() : slug,
      description: descMatch ? descMatch[1].replace(/\s+/g, ' ').trim() : '',
    };
    console.log('OK', slug);
  } catch (e) {
    console.log('FAIL', slug, e.message);
  }
}

// Fallback for local x product page
const localX = path.join('oferta', 'x', 'stol1.html');
if (!result.x?.description && fs.existsSync(localX)) {
  const html = fs.readFileSync(localX, 'utf8');
  const titleMatch = html.match(/<h1>([^<]+)<\/h1>/);
  const descMatch = html.match(/<div class="opis">\s*<p>([\s\S]*?)<\/p>/);
  result.x = {
    title: titleMatch ? titleMatch[1].trim() : 'Stół koło X',
    description: descMatch ? descMatch[1].replace(/\s+/g, ' ').trim() : '',
  };
}

fs.writeFileSync('scraped-products.json', JSON.stringify(result, null, 2), 'utf8');
console.log('Done', Object.keys(result).length);
