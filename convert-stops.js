import fs from 'fs';
import { parse } from 'csv-parse/sync';

// Read stops.txt
const csv = fs.readFileSync('stops.txt', 'utf8');

// Parse CSV into an array of objects
const records = parse(csv, {
  columns: true,       // use header row
  skip_empty_lines: true
});

// Keep only stop_id and stop_name
const stops = records.map(r => ({
  stop_id: r.stop_id,
  stop_name: r.stop_name
}));

fs.writeFileSync('stops.json', JSON.stringify(stops, null, 2));
console.log(`stops.json created with ${stops.length} stops`);
