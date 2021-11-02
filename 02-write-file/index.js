const fs = require('fs');
const path = require('path');
const readline = require('readline');
const stream = require('stream');

const filepath = path.join(__dirname, 'lololo.txt');

let writeableStream = fs.createWriteStream(filepath);

process.stdout.write('--- Let`s start! ---\n')

process.stdin.on('data', (item) => {
    let text = item.toString()
    if (text.toString().trim()  === 'exit') {
        processExit()
    } else {
        writeableStream.write(text)
    }
})
  
process.on('SIGINT', processExit);

function processExit() {
    process.stdout.write('--- That`s all! ---')
    process.exit()
}