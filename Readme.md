# generate-strapi-typescript

This package allows you to generate interfaces from your strapi content model.

Currently, it supports only local generation - you need to have strapi instance inside your project

## Instalation
```shell
npm i --save-dev generate-strapi-typescript
```

or with yarn

```shell
yarn -D generate-strapi-typescript
```

## Usage
You need to specify two paramteres:
1. Path to strapi `src` directory
2. Full file name for generated types

i.e.
```shell
gsc ./strapi/src ./types/strapi.d.ts
```

## Limitations
* Currently, this package does not lint the file with interface, so make sure to add it to your `.eslintignore` file
* Every component matches the following interface name: `C[CategoryName][ComponentName]` to avoid name conflicts
* Every Collection/Single type has its own name as an interface name

## Notes
* Strapi v4 has different approaches for serving content through REST API so feel free to submit any issues
* For my company purposes this works fine. Our content model look like this:
```
src/
|---api/
|   |---[modelName]
|       |---content-types
|           |---[modelName]
|               |---schema.json                    
|---components/
    |---[categoryName]/
        |---[componentName].json
```
