import fs from 'fs';
import { parse } from 'csv-parse/sync';

// Read routes.txt
const csv = fs.readFileSync('routes.txt', 'utf8');

// Parse CSV into objects
const records = parse(csv, {
  columns: true,
  skip_empty_lines: true
});

// Keep only route_id and route_short_name (optionally route_long_name)
const routes = records.map(r => ({
  route_id: r.route_id,
  route_short_name: r.route_short_name,
  route_long_name: r.route_long_name
}));

// Save as JSON
fs.writeFileSync('routes.json', JSON.stringify(routes, null, 2));
console.log(`routes.json created with ${routes.length} routes`);
