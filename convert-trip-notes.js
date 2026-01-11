import fs from 'fs';
import { parse } from 'csv-parse/sync';

// 1️⃣ Read the CSV file
const csv = fs.readFileSync('trip_notes.txt', 'utf8');

// 2️⃣ Parse CSV into objects
const records = parse(csv, {
  columns: true,        // Use first row as keys
  skip_empty_lines: true
});

// 3️⃣ Pick the fields you want from each row
const trips = records.map(r => ({
  trip_id: r.trip_id,
  service_id: r.service_id,
  trip_pattern_id: r.trip_pattern_id,
  abbreviation: r.abbreviation,
  description: r.description,
  from_stop_id: r.from_stop_id,
  from_stop_sequence: r.from_stop_sequence,
  to_stop_id: r.to_stop_id,
  to_stop_sequence: r.to_stop_sequence
}));

// 4️⃣ Save as JSON
fs.writeFileSync('trip_notes.json', JSON.stringify(trips, null, 2));

console.log(`trip_notes.json created with ${trips.length} trips`);