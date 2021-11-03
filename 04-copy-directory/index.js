const fs = require('fs');
const path = require('path');
const stream = require('stream');
const fsPromises = fs.promises;

function createDir() {
    fsPromises.mkdir(path.join(__dirname, 'files-copy'))
          .then(function() {})
          .catch(function() {
            console.log('Directory has already been created');
          })
}

function copyToFile(file) {
    try {
        fsPromises.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file));
    } catch {
        console.log('The file could not be copied');
    }
}


function readDir() {
    fs.readdir(path.join(__dirname, 'files'), { withFileTypes: true }, (err, files) => {
        files.filter(dirent => !dirent.isDirectory())
             .forEach(item => copyToFile(item.name))
        }
    )
}

createDir()
readDir()