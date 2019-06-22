# rollup-plugin-merge-and-inject-css

> A rollup plugin to collect and combine all the imported css file and inject them to the head at the top of style blocks list.

[![NPM](https://img.shields.io/npm/v/rollup-plugin-merge-and-inject-css.svg)](https://www.npmjs.com/package/rollup-plugin-merge-and-inject-css) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save-dev rollup-plugin-merge-and-inject-css
```
```bash
yarn add rollup-plugin-merge-and-inject-css --dev
```

## Plugin options

| Name     | Type              | Required | Description
|----------|-------------------|----------|-------------
| id       | String            | false    | The `id` of your rollup build, it's needed to update build properly in watch mode. Default value is the random `uid` for a current watch run.

## Usage

The common scenario for using this plugin is the merging of css files produced by different component. For example, it's useful for [rollup-plugin-vue](https://github.com/vuejs/rollup-plugin-vue).

The default inject tool of this plugin will produce something like that:
```html
  <style>
    .red-component {
      color: red;
    }
  </style>
  <style>
    .blue-component {
      color: blue;
    }
  </style>
  <style>
    .green-component {
      color: green;
    }
  </style>
```

This plugin will produce this (if all that components are the part of a generating bundle):
```html
  <style>
    /*for=example-components*/
    .red-component {
      color: red;
    }
    .blue-component {
      color: blue;
    }
    .green-component {
      color: green;
    }
  </style>
```

## Example

The example of the rollup config with this plugin
```js
import autoprefixer from 'autoprefixer';
import Vue from 'rollup-plugin-vue';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import sass from 'rollup-plugin-sass';
import css from 'rollup-plugin-merge-and-inject-css'

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    css({
      id: 'example-components'
    }),
    Vue({
      css: false,
      style: {
        postcssPlugins: [autoprefixer]
      }
    }),
    url(),
    babel({
      exclude: 'node_modules/**',
    }),
    resolve(),
    commonjs(),
  ]
}

```
