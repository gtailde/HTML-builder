const fs = require('fs');
const path = require('path')

out = (name, size) => {
  let x = name.split('.');
  console.log(`${x[0]} - ${x[x.length-1]} - ${size} byte`);
};

open = () => {
  let dataNames = [];
  fs.readdir(path.join(__dirname, './secret-folder'), (err, files) => {
    if(err) throw err; 
    (files.join(' ').split(' ')).forEach((name) => {
      dataNames.push(name);
    });
     dataNames.forEach((name)=>{
      fs.stat(`03-files-in-folder/secret-folder/${name}`, (err, stats) => {
        if (err) {
          console.error('ERROR', err.message);
          return;
        }
        if(stats.isFile()){
          out(name, stats.size);
        }; 
      }); 
    });
  });
};

open();