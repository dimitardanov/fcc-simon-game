
console.log('Updating package.json ...');

const fs = require('fs');
const path = require('path');
const prompt = require('prompt');
prompt.message = '';

var packageJSON = JSON.parse(fs.readFileSync('package.json'));

// fields to delete
var delKeys = ['main', 'repository'];

delKeys.forEach(function(key) {
  delete packageJSON[key];
});

var promptVals = [
  {
    name: 'name',
    description: 'Project name',
    default: path.basename(process.cwd())
  },
  {
    name: 'author',
    description: 'Author',
  },
  {
    name: 'description',
    description: 'Description'
  },
  {
    name: 'version',
    description: 'Version',
    default: '1.0.0'
  },
  {
    name: 'license',
    description: 'License',
    default: 'MIT'
  }
];

function setKeys() {
  prompt.start();
  prompt.get(promptVals, function(err, result) {
    if (err) {
      console.log('Aborting...');
    }
    Object.keys(result).forEach(function(key) {
      packageJSON[key] = result[key];
    });
    fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, 2));
    console.log('package.json written.');
  });
}

setKeys();
