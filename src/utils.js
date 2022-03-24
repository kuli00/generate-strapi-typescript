export const isFileJson = filePath => filePath.endsWith('.json');
export const toPascalCase = value =>
  value
    .split(/-|_/g)
    .map(v => v[0].toUpperCase() + v.substring(1))
    .join('');
