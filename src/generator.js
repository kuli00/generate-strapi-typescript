import fs from 'fs';

import getComponentType from './componentType.helper.js';
import { collectionDefaultAttributes } from './defaultStrapiInterfaces.js';
import { toPascalCase } from './utils.js';

const generateAttributes = (attributes) => {
  return Object.keys(attributes).map(key => {
    return `${key}${attributes[key].required ? '' : '?'}: ${getComponentType(attributes[key])};`
  }).join('\n');
}

export const generateInterface = (interfaceName, attributes, isComponent = false) => {
  let interfaceString = `export interface ${interfaceName} {\n`;
  interfaceString += 'id: number;\n';
  if (isComponent) {
    interfaceString += generateAttributes(attributes);
  } else {
    interfaceString += 'attributes: {';
    interfaceString += generateAttributes(attributes);
    interfaceString += '\n}';
  }

  interfaceString += '}\n';
  return interfaceString;
};

export const generateInterfaceFromComponent = componentFilePath => {
  const componentId = componentFilePath.split('/').pop().slice(0, -5);
  const component = JSON.parse(fs.readFileSync(componentFilePath));
  const interfaceName = `C${toPascalCase(
    component.collectionName.split('_')[1],
  )}${toPascalCase(componentId)}`;
  return generateInterface(interfaceName, component.attributes, true);
};

export const generateInterfaceFromApiModel = modelFilePath => {
  const model = JSON.parse(fs.readFileSync(modelFilePath));
  return generateInterface(toPascalCase(model.info.displayName), {
    ...collectionDefaultAttributes,
    ...model.attributes,
  });
};
