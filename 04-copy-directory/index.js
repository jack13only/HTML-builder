const fs = require('fs');
const path = require('path');
const stream = require('stream');
const fsPromises = fs.promises;


function createDir() {
    fsPromises.mkdir(path.join(__dirname, 'files-copy'))
          .catch(function() {
            console.log('Directory has already been created');
          })
}

function copyDir() {
    fsPromises.rmdir(path.join(__dirname, 'files-copy'), { recursive: true, force: true })
          .then(() => {
            createDir()
          })
          .then(() => {
            readDir()
          })
          .catch(function() {
            console.log('Something go wrong');
          })
}

function copyToFile(file) {
    try {
        fsPromises.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file));
    } catch {
        console.log('Copy error');
    }
}

function readDir() {
    fs.readdir(path.join(__dirname, 'files'), { withFileTypes: true }, (err, files) => {
        files.filter(dirent => !dirent.isDirectory())
             .forEach(item => copyToFile(item.name))
        }
    )
}

copyDir()
