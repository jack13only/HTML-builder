const fs = require('fs');
const path = require('path');
const stream = require('stream');
const fsPromises = fs.promises;


function copyStyles() {
    fsPromises.rm(path.join(__dirname, 'project-dist', 'bundle.css'), { force: true, recursive: true })
          .then(() => {
            fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
                  .then(files => {
                        return files.filter(dirent => !dirent.isDirectory())
                                    .filter(item => path.extname(item.name).slice(1) === 'css')
                  })
                  .then(async function processArray(files) {
                        for (const file of files) {
                              await fsPromises.readFile(path.join(__dirname, 'styles', file.name))
                                    .then(buff => {
                                          const content = buff.toString()
                                          return fs.promises.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), content + '\n')
                                    })
                        }
                  })
                  .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
}

copyStyles()