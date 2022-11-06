const fs = require('fs');
const path = require("path");
const txtFile = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(txtFile);
process.stdout.write('\nPlease enter your text...\nTo exit please enter (ctrl + c) or (exit).\n\n');
process.openStdin().on('data', data => {
  if(data.toString('UTF8').trim() === 'exit') {
    process.exit(0);
  } else {stream.write(data)};
});
process.on('exit', () => process.stdout.write('\nGood luck in your studies)\n\n'));
process.on('SIGINT', () => process.exit(0));