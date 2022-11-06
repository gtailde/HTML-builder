const fs = require('fs');
const path = require('path');

function creatDir(){
  fs.mkdir(path.join(__dirname, 'files-copy'), err => {
    if(err) throw err; 
  });
};

fs.readdir(path.join(__dirname), (err, files) => {
  if(err) throw err; 
  let check = [];
  (files.join(' ').split(' ')).forEach((name) => {
    check.push(name);
  });
  if(!check.includes('files-copy')) creatDir();
  openValidDirectory();
});

function copy(name, line){
  fs.copyFile(name, line, err => {
    if(err) throw err; 
  });
};

function del(name){
  fs.unlink(name, err => {
    if(err) throw err;
  });
};

openValidDirectory = () => {
  let allFilesOfCopyDirectory = [];
  fs.readdir(path.join(__dirname, './files-copy'), (err, files) => {
    if(err) throw err; 
    (files.join(' ').split(' ')).forEach((name) => {
      allFilesOfCopyDirectory.push(name);
    });
  });
  fs.readdir(path.join(__dirname, './files'), (err, files) => {
    let correctFile = [];
    if(err) throw err; 
    (files.join(' ').split(' ')).forEach((name) => {
      correctFile.push(name);
    });
    let line = `04-copy-directory`;
    correctFile.forEach((name)=>{
      fs.stat(`${line}/files/${name}`, (err, stats) => {
        if (err) {
          console.error('ERROR', err.message);
          return;
        };        
        for(let i = 0; i < allFilesOfCopyDirectory.length; i++){
          if(!correctFile.includes(allFilesOfCopyDirectory[i]) && allFilesOfCopyDirectory[i].length > 0){
            del(`04-copy-directory/files-copy/${allFilesOfCopyDirectory[i]}`)
            allFilesOfCopyDirectory[i] = '';
          };
        };
        if(stats.isFile()){copy(`${line}/files/${name}`, `${line}/files-copy/${name}`)};
      });
    });
  });
};