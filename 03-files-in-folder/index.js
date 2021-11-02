const fs = require('fs');
const path = require('path');
const stream = require('stream');

const filepath = path.join(__dirname, 'secret-folder');

fs.readdir(filepath, 
  { withFileTypes: true },
    (err, files) => {
    console.log("\nFiles:\n");
      files.filter(dirent => 
        !dirent.isDirectory()).forEach(item => 
            fs.stat(path.join(__dirname, 'secret-folder', item.name), 
                    (err, stats) => {
                        console.log(item.name.slice(0, item.name.lastIndexOf('.'))
                        + 
                        ' - ' 
                        + 
                        path.extname(item.name).slice(1) 
                        + 
                        ' - ' 
                        + 
                        (stats.size) 
                        +
                        ' byte');
                    })
    )}
)
