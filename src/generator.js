import fs from 'fs';

import getComponentType from './componentType.helper.js';
import {collectionDefaultAttributes} from './defaultStrapiInterfaces.js';
import {toPascalCase} from './utils.js';

export const generateInterface = (interfaceName, attributes) => {
  let interfaceString = `export interface ${interfaceName} {\n`;
  interfaceString += 'id: number;\n';
  interfaceString += 'attributes: {\n'
  Object.keys(attributes).forEach(key => {
    interfaceString += `${key}${attributes[key].required ? '' : '?'}: ${getComponentType(attributes[key])};\n`;
  })
  interfaceString += '}\n}';
  return interfaceString;
};

export const generateInterfaceFromComponent = (componentFilePath) => {
  const component = JSON.parse(fs.readFileSync(componentFilePath));
  const interfaceName = `C${toPascalCase(component.collectionName.split('_')[1])}${toPascalCase(component.info.displayName)}`
  return generateInterface(interfaceName, component.attributes);
}

export const generateInterfaceFromApiModel = (modelFilePath) => {
  const model = JSON.parse(fs.readFileSync(modelFilePath));
  return generateInterface(toPascalCase(model.info.displayName), {...collectionDefaultAttributes, ...model.attributes});
}
