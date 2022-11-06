const fs = require('fs');
const path = require("path");
const bundleCSS = path.join(`05-merge-styles/project-dist/bundle.css`);
const streamCreated = fs.createWriteStream(bundleCSS);
read = (x) => {
  const streamRead = new fs.ReadStream(path.join(__dirname, `styles/${x}`), 'UTF8');
  let data = '';
  streamRead.on('data', chunk => {data += chunk});
  streamRead.on('end', function(){writeStyles(`${data}\n`)});
  streamRead.on("error", err => {console.log('ERROR', err.message)});
};

writeStyles = (data) => {
  streamCreated.write(data);
};

fs.readdir(path.join(__dirname, './styles'), (err, files) => {
  if(err) throw err; 
  let filesCSS = [];
  (files.join(' ').split(' ')).forEach((name) => {
    filesCSS.push(name);
  });
  for(let i = 0; i < filesCSS.length; i++){
    let x = filesCSS[i].split('.');
    fs.stat(`05-merge-styles/styles/${filesCSS[i]}`, (err, stats) => {
      if (err) {
        console.error('ERROR', err.message);
        return;
      }
      if(stats.isFile()){
        if(x[x.length-1] === 'css' && stats.isFile()){read(filesCSS[i])};
      }; 
    });
    
  };
});