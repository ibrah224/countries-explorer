import { writeFileSync, mkdirSync } from 'node:fs';

const KEY = process.env.RC_KEY;
if (!KEY) {
  console.error('Définis RC_KEY avant de lancer le script.');
  process.exit(1);
}

const fields = [
  'names.common', 'names.official', 'codes.alpha_2', 'codes.alpha_3',
  'capitals', 'population', 'region', 'subregion', 'continents',
  'flag.emoji', 'flag.url_svg', 'flag.url_png', 'flag.description',
  'coordinates.lat', 'coordinates.lng', 'area.kilometers',
  'languages', 'currencies', 'borders', 'timezones',
  'government_type', 'links.google_maps', 'links.wikipedia',
].join(',');

const all = [];
for (let offset = 0; ; offset += 100) {
  const url = `https://api.restcountries.com/countries/v5?limit=100&offset=${offset}&response_fields=${fields}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${KEY}` } });
  if (!res.ok) {
    console.error(res.status, await res.text());
    process.exit(1);
  }
  const json = await res.json();
  all.push(...json.data.objects);
  console.log(`${all.length} / ${json.data.meta.total}`);
  if (!json.data.meta.more) break;
}

mkdirSync('public', { recursive: true });
writeFileSync('public/countries.json', JSON.stringify(all));
console.log('OK : public/countries.json créé');