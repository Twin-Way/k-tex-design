const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// const DATA = require('./data.json');
const dataPath = path.join(__dirname, 'data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const DATA = JSON.parse(rawData);


const partialsDir = path.join(__dirname, 'templates');
fs.readdirSync(partialsDir)
    .filter(f => f.endsWith('.hbs') && f !== 'index.hbs')
    .forEach(file => {
        const name = path.basename(file, '.hbs');
        const src = fs.readFileSync(path.join(partialsDir, file), 'utf8');
        Handlebars.registerPartial(name, src);
    });

const indexSrc = fs.readFileSync(path.join(partialsDir, 'index.hbs'), 'utf8');
const template = Handlebars.compile(indexSrc);

const output = template(DATA);

const outDir = path.join(__dirname, 'dist');

fs.writeFileSync(path.join(outDir, 'index.html'), output);

console.log('Generated dist/index.html');