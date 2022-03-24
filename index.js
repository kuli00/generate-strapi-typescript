import fs from 'fs';

const [, , strapiPath, outFilePath] = process.argv;

if (!strapiPath || !outFilePath) {
  throw new Error('Missing required params');
}

const isFileJson = filePath => filePath.indexOf('.json') === filePath.length - 5
const toPascalCase = value => {
  return value.split('-').map(v => v[0].toUpperCase() + v.substring(1)).join('');
}

const mediaInterface = `export interface Media {
  id: number;
  attributes: {
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: {
      thumbnail: MediaFormat;
      medium: MediaFormat;
      small: MediaFormat;
      large: MediaFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string;
    provider: string;
    createdAt: Date;
    updatedAt: Date;
  }
}`

const mediaFormatInterface = `export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path: string;
  url: string;
}`;

const collectionDefaultAttributes = {
  createdAt: { type: 'date', required: true },
  updatedAt: { type: 'date' },
  publishedAt: { type: 'date' },
}

const getAllJsonFiles = () => {
  const componentsJsons = [];
  const componentsPath = `${strapiPath}/components`;
  const componentsDirectory = fs.readdirSync(componentsPath);

  const apiJsons = [];
  const apiPath = `${strapiPath}/api`;
  const apiDirectory = fs.readdirSync(apiPath);

  componentsDirectory.forEach(filePath => {
    if (fs.lstatSync(`${componentsPath}/${filePath}`).isDirectory()) {
      const subDirPath = `${componentsPath}/${filePath}`;
      const subDir = fs.readdirSync(subDirPath);

      return componentsJsons.push(...subDir.filter(isFileJson).map(file => `${componentsPath}/${filePath}/${file}`));
    }

    if (!isFileJson(filePath)) return;

    componentsJsons.push(`${componentsPath}/${filePath}`);
  })

  apiDirectory.forEach(modelPath => {
    if (modelPath.indexOf('.') === 0) return;
    apiJsons.push(`${apiPath}/${modelPath}/content-types/${modelPath}/schema.json`);
  })

  return [
    componentsJsons,
    apiJsons,
  ]
}

const getType = (attribute) => {
  switch(attribute.type) {
    // String
    case 'richtext':
    case 'string':
    case 'email':
    case 'date':
    case 'datetime':
    case 'time':
    case 'password':
    case 'text':
      return 'string';

    // Enum
    case 'enumeration':
      return attribute.enum.map(v => `'${v}'`).join(' | ');

    // Number
    case 'integer':
    case 'decimal':
    case 'float':
    case 'biginteger':
      return 'number';

    // Object
    case 'json':
      return 'object';

    // Boolean
    case 'boolean':
      return 'boolean';

    // Relation
    case 'relation':
      return `${toPascalCase(
        attribute
          .target
          .split('.')
          .pop()
      )}${attribute.relation === 'oneToMany' ? '[]' : ''}`;

    // Component
    case 'component':
        return `C${toPascalCase(
          attribute
            .component
            .split('.')
            .map(toPascalCase)
            .join('')
        )}${attribute.repeatable ? '[]' : ''}`;

    // Media
    case 'media':
      return `Media${attribute.multiple ? '[]' : ''}`;

    // Dynamiczone
    case 'dynamiczone':
      return `(${attribute.components.map(c => `C${toPascalCase(
        c
          .split('.')
          .map(toPascalCase)
          .join(''))}`)
        .join(' | ')})[]`;


    default:
      return null;
  }
}

const generateInterface = (interfaceName, attributes) => {
  let interfaceString = `export interface ${interfaceName} {\n`;
  interfaceString += 'id: number;\n';
  interfaceString += 'attributes: {\n'
  Object.keys(attributes).forEach(key => {
    interfaceString += `${key}${attributes[key].required ? '' : '?'}: ${getType(attributes[key])};\n`;
  })
  interfaceString += '}\n}';
  return interfaceString;
};

const generateInterfaceFromComponent = (componentFilePath) => {
  const component = JSON.parse(fs.readFileSync(componentFilePath));
  const interfaceName = `C${toPascalCase(component.collectionName.split('_')[1])}${toPascalCase(component.info.displayName)}`
  return generateInterface(interfaceName, component.attributes);
}

const generateInterfaceFromApiModel = (modelFilePath) => {
  const model = JSON.parse(fs.readFileSync(modelFilePath));
  return generateInterface(toPascalCase(model.info.displayName), {...collectionDefaultAttributes, ...model.attributes});
}

const [components, apiModels] = getAllJsonFiles();

const componentsInterfaces = components.map(generateInterfaceFromComponent);
const apiInterfaces = apiModels.map(generateInterfaceFromApiModel)

fs.writeFileSync('./types.ts', [
  mediaInterface,
  mediaFormatInterface,
  apiInterfaces.join('\n'),
  componentsInterfaces.join('\n'),
].join('\n'));

export default null;