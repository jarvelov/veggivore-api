# Veggivore-API

> Veggivore API server  

## Pre-install

Install [`yarn`](https://yarnpkg.com)

Then install `node-gyp` as we need it later to build `bcrypt`

`yarn global add node-gyp`

## Install

`yarn install`

## Run

### Development

`yarn dev`

### Build

`yarn build`

A single bundled server file is created and can be then be hosted with a server

### Serve

`yarn serve`

Starts `nodemon` to handle server

### TODO

* Fix all lint errors
* Don't use the /pages/ prefix on routes, use /[ROUTE]/pages instead, but keep the /pages route to aggregate all pages
  * We want this since you might want to access other properties, such as a company's employees using /companies/[COMPANY]/employees
  * Or: /companies/[COMPANY]/stores, /companies/[COMPANY]/locations etc.
* Set up server clustering
* Add versioned API
