const Webpack = require('webpack')
const { merge } = require('webpack-merge')
const webpackConfig = require('./webpack.config.js')

module.exports = merge(webpackConfig, {
    mode: 'production',
    devtool: false,
})