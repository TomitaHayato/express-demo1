const path = require('path');

const vals = [
  // __dirname,
  // __filename,
  path.resolve(__dirname, 'views/index.ejs'),
  path.join( __dirname, 'views/index.ejs'),
];

for (const val of vals) {
  console.log(val);
}
