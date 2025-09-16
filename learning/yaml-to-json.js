import * as fs from 'fs'
import * as yaml from 'js-yaml'

const yamlDataFromFile = fs.readFileSync('ST Swagger Doc for Backflipt.yaml', 'utf8');
const jsonData = JSON.stringify(yaml.load(yamlDataFromFile), null, 2);

console.log(jsonData);

