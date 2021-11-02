const fs = require('fs');
const path = require('path');


const filepath = path.join(__dirname, 'text.txt');
const fileStream = fs.createReadStream(filepath);
fileStream.setEncoding('utf8');
let text = '';

fileStream.on('data', (chunk) => {
    text += chunk;
});

fileStream.on('end', () => {
    console.log(text);
});