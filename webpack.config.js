var webpack = require('webpack');
var path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSASS = new ExtractTextPlugin('styles/sass-style.css');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/
      },
			{
				//this will compile any scss files referenced and create a separate css file
				test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'sass-loader']
        })
			}
    ]
  },
	plugins: [
		new ExtractTextPlugin("sass-styles.css"),
	]
};
