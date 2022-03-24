import { toPascalCase } from './utils.js'

const getComponentType = attribute => {
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

export default getComponentType;
