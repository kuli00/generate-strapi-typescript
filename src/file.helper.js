import fs from 'fs';

import { isFileJson } from './utils.js';

const getComponentsPath = strapiPath => strapiPath + '/components';
const getModelsPath = strapiPath => strapiPath + '/api';

const isFileDirectory = path => fs.lstatSync(path).isDirectory();

const findJsonsInDirectory = dirPath => {
  const filesPath = [];
  const dir = fs.readdirSync(dirPath);
  dir.forEach(filePath => {
    if (!isFileJson(filePath)) return;

    filesPath.push(`${dirPath}/${filePath}`);
  });

  return filesPath;
};

const getComponentsPaths = strapiPath => {
  const componentsPaths = [];
  const componentsDirectoryPath = getComponentsPath(strapiPath);
  const componentsDirectory = fs.readdirSync(componentsDirectoryPath);

  componentsPaths.push(...findJsonsInDirectory(componentsDirectoryPath));
  componentsPaths.push(
    ...componentsDirectory
      .flatMap(fileName => {
        const pathToFile = `${componentsDirectoryPath}/${fileName}`;
        if (!isFileDirectory(pathToFile)) return null;
        return findJsonsInDirectory(pathToFile);
      })
      .filter(Boolean),
  );

  return componentsPaths;
};

const getModelsPaths = strapiPath => {
  const modelsPaths = [];
  const apiDirectoryPath = getModelsPath(strapiPath);
  const apiDirectory = fs.readdirSync(apiDirectoryPath);

  apiDirectory.forEach(modelName => {
    if (modelName.startsWith('.')) return;
    modelsPaths.push(
      `${apiDirectoryPath}/${modelName}/content-types/${modelName}/schema.json`,
    );
  });

  return modelsPaths;
};

export const getAllJsonsPaths = strapiPath => [
  getComponentsPaths(strapiPath),
  getModelsPaths(strapiPath),
];
