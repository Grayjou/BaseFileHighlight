// This file should NOT be highlighted (default color)
// It requires a local module

const express = require('express');
const myModule = require('./base_file_commonjs');

const app = express();

app.use('/api', myModule);

module.exports = app;
