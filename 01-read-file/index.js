const fs = require('fs');
const path = require('path');
let data = '';

const stream = new fs.ReadStream(path.join(__dirname, 'text.txt'), 'UTF8'); 

stream.on('data', chunk => {data += chunk});
stream.on('end', function(){console.log((data))});
stream.on("error", err => {console.log('ERROR', err.message)});