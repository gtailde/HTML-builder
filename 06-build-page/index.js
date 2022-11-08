const fs = require('fs');
const path = require("path");
const { Z_ASCII } = require('zlib');
function creatDir(foldersName){
  fs.mkdir(path.join(__dirname, foldersName), err => {});
}
readFolder = (foldersName) => {
  fs.readdir(path.join(__dirname), (err, files) => {
    let check = [];
    (files.join(' ').split(' ')).forEach((name) => {
      check.push(name);
    });
    if(err) throw err; 
    if(!check.includes(foldersName)) creatDir(foldersName);
    next();
  });
};
readFolder('project-dist')
function next(){
  const style = path.join(`06-build-page/project-dist/style.css`);
  const streamCreatedStyle = fs.createWriteStream(style);
  const index = path.join(`06-build-page/project-dist/index.html`);
  const streamCreatedIndex = fs.createWriteStream(index);
  countt = (a) =>{
    let x = '';
    let ret = 0;
    let arr = [];
    while(x !== 'not'){
        if(a.includes('{{') && a.includes('}}')){
          arr.push(a.slice(a.indexOf('{'), a.indexOf('}')+2))
          a = a.slice(a.indexOf('}')+2);
          ret++;
      } else {x = 'not'};
    };    
    arr.push(ret);
    return arr;
  };
  read = (x, type, cl) => {
    let data = '';
    if(type == 'css'){
      const streamReadStyle = new fs.ReadStream(path.join(__dirname, `styles/${x}`), 'UTF8');
      streamReadStyle.on('data', chunk => {data += chunk});
      streamReadStyle.on('end', function(){writeData(`${data}\n`, 'css')});
      streamReadStyle.on("error", err => {console.log('ERROR', err.message)});
    } else if(type == 'html'){
      const streamReadHtml = new fs.ReadStream(path.join(__dirname, `components/${x}`), 'UTF8');
      streamReadHtml.on('data', chunk => {data += chunk});
      streamReadHtml.on('end', function(){writeData(`${data}`, 'html', cl)});
      streamReadHtml.on("error", err => {console.log('ERROR', err.message)});
    } else if(type == 'template'){
      const streamTemplate = new fs.ReadStream(path.join(__dirname, `template.html`), 'UTF8');
      streamTemplate.on('data', chunk => {data += chunk});
      streamTemplate.on('end', function(){writeData(`${data}`, 'template')});
      streamTemplate.on("error", err => {console.log('ERROR', err.message)});
    };
  };
  let x = 0;
  let template = '';
  let positionEl = [];
  let indEl = [];
  let counter = 0;
  let dataOfEl = [];
  let dats = []
  writeData = (data, type, cl) => {
    if(type == 'css'){
      streamCreatedStyle.write(data);
    } else if(type == 'html'){
      counter += 1;
      dataOfEl.push(data)
      indEl.push(cl.slice(0, cl.indexOf('.')));
      
      if(positionEl.join().includes(`{{${cl.slice(0, cl.indexOf('.'))}}}`)){
        template = template.replaceAll(`{{${cl.slice(0, cl.indexOf('.'))}}}`, data)
        dats.push(template);
      }
      
    if(counter == positionEl.length ){
      streamCreatedIndex.write(template);      
    }
    } else if(type == 'template'){
      template = data;
      let a = '';
      a = template;  
      x = countt(a)
      positionEl = x.slice(0, x.length-1);
      
      x = x.length;      
     
    };
  };
  read(0, 'template');
  
  // read css and add
  fs.readdir(path.join(__dirname, './styles'), (err, files) => {
    if(err) throw err; 
    let filesCSS = [];
    (files.join(' ').split(' ')).forEach((name) => {
      filesCSS.push(name);
    });
    for(let i = 0; i < filesCSS.length; i++){
      let x = filesCSS[i].split('.');
      fs.stat(`06-build-page/styles/${filesCSS[i]}`, (err, stats) => {
        if (err) {
          console.error('ERROR', err.message);
          return;
        }
        if(stats.isFile()){
          if(x[x.length-1] === 'css' && stats.isFile()){read(filesCSS[i], 'css')};
        }; 
      });
    };
  });
    
  // read html and add
  
  fs.readdir(path.join(__dirname, './components'), (err, files) => {
    if(err) throw err; 
    let filesIndexHTML = [];
    (files.join(' ').split(' ')).forEach((name) => {
      filesIndexHTML.push(name);
    });
    for(let i = 0; i < filesIndexHTML.length; i++){
      let x = filesIndexHTML[i].split('.');
      fs.stat(`06-build-page/components/${filesIndexHTML[i]}`, (err, stats) => {
        if (err) {
          console.error('ERROR', err.message);
          return;
        }
        if(stats.isFile()){
          if(x[x.length-1] === 'html' && stats.isFile()){read(filesIndexHTML[i], 'html', filesIndexHTML[i])};
        }; 
      });
    };
  });
};


// Copy assets
let wayToCopy = path.join(__dirname, 'project-dist', 'assets');
let wayFromCopy = path.join(__dirname, 'assets');

copyAssets(wayFromCopy, wayToCopy)

async function copyAssets (wayFromCopy, wayToCopy){
  await fs.promises.mkdir(wayFromCopy, {recursive: true});
  try {
    const filesInDirrect = await fs.promises.readdir(wayFromCopy, {withFileTypes: true});
    for(let file of filesInDirrect){
      if(file.isFile()){
        await fs.promises.copyFile(path.resolve(wayFromCopy, file.name), path.resolve(wayToCopy, file.name));
      } else if(!file.isFile()){
        await fs.promises.mkdir(path.resolve(wayToCopy, file.name), {recursive: true});
        await copyAssets(path.resolve(wayFromCopy, file.name), path.resolve(wayToCopy, file.name));
      };
    };
  } catch(error){
    console.log(error);
  };
};
