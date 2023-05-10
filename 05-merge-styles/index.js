const { promises: fsPromises } = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const bundleCSS = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  try {
    const files = await fsPromises.readdir(stylesDir);
    
    const cssFiles = files.filter(file => path.extname(file) === '.css');
    
    const data = await Promise.all(cssFiles.map(async file => {
      const filePath = path.join(stylesDir, file);
      return await fsPromises.readFile(filePath, 'utf8');
    }));

    const distDir = path.join(__dirname, 'project-dist');
    try {
      await fsPromises.access(distDir);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fsPromises.mkdir(distDir);
      } else {
        throw err;
      }
    }

    await fsPromises.writeFile(bundleCSS, data.join('\n'));
    
    console.log('Styles merged successfully');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

mergeStyles();