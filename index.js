#! /usr/bin/env node

import fs from 'fs';

import { mediaInterface, mediaFormatInterface } from './src/defaultStrapiInterfaces.js'
import { generateInterfaceFromApiModel, generateInterfaceFromComponent } from './src/generator.js'
import { getAllJsonsPaths } from './src/file.helper.js'

const [, , strapiPath, outFilePath] = process.argv;

if (!strapiPath || !outFilePath) {
  throw new Error('Missing required params. Example usage: gst strapiRoot/src ./types.ts');
}

const [components, apiModels] = getAllJsonsPaths(strapiPath);

const componentsInterfaces = components.map(generateInterfaceFromComponent);
const apiInterfaces = apiModels.map(generateInterfaceFromApiModel)

fs.writeFileSync(outFilePath, [
  mediaInterface,
  mediaFormatInterface,
  apiInterfaces.join('\n'),
  componentsInterfaces.join('\n'),
].join('\n'));
