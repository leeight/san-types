/**
 * @file webpack.config.js
 * @author leeight
 */

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './main.js',
    output: {
        filename: '[name].js',
        path: __dirname + '/dist',
        libraryTarget: 'umd'
    },
    plugins: [
        new UglifyJsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.mjs$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};










