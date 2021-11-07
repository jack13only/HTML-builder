const fs = require('fs');
const path = require('path');
const stream = require('stream');
const fsPromises = fs.promises;

async function createDir(dirName) {
    fsPromises.mkdir(dirName)
        .catch(function(e) {
            console.log(e);
        })
}

function copyToFile(fileFrom, fileTo) {
    try {
        fsPromises.copyFile((fileFrom), path.join(fileTo));
    } catch {
        console.log('Copy error');
    }
}

async function readDir(dirNameFrom, dirNameTo) {
    fs.readdir((dirNameFrom), { withFileTypes: true }, (err, files) => {
        files.forEach(dirent => {
            let dirNamesFrom = dirNameFrom
            let dirNamesTo = dirNameTo           
            if (dirent.isDirectory()) {
                createDir(path.join(dirNamesTo, dirent.name))
                readDir(path.join(dirNamesFrom, dirent.name), path.join(dirNamesTo, dirent.name))
            } else {
                copyToFile(path.join(dirNamesFrom, dirent.name), path.join(dirNamesTo, dirent.name))
            }
        })
    })
}

function buildPage() {
    fsPromises.rm(path.join(__dirname, 'project-dist'), { recursive: true, force: true })
          .then(() => {
            createDir(path.join(__dirname, 'project-dist'))
          })
          .then(() => {
            createDir(path.join(__dirname, 'project-dist' ,'assets'))
          })
          .then(() => {
            readDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist' ,'assets'))
          })
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
                                          return fsPromises.appendFile(path.join(__dirname, 'project-dist', 'style.css'), content + '\n\n')
                                    })
                        }
                  })
                  .catch(err => console.log(err))
          })
          .then(async () => {
            const rxp = /{{([^}]+)}}/g
            let template = (await fsPromises.readFile(path.join(__dirname, 'template.html'))).toString()
            while (componentName = rxp.exec(template)) {
                let componentHtml = (await fsPromises.readFile(path.join(__dirname, 'components', `${componentName[1]}.html`))).toString()
                template = template.replace(`{{${componentName[1]}}}`, componentHtml)
            }
            await fsPromises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template)
          })
          .catch(function() {
            console.log('Something go wrong');
          })
}

buildPage()