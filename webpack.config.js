const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: "./src/index.js"
  },
  devtool: 'inline-source-map',
  devServer: {
      contentBase: './dist'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Output Management',
      template: './src/index.pug',
        hash: true
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    })
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
            name: 'images/fonts/[name].[ext]?[hash:8]'
        }
      },
      {
        test: /\.pug$/,
        loader: "pug-loader",
        query: {
            inlineRequires: '\/images\/'
        }
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
          loader: 'babel-loader',
          options: {
              presets: ['env']
          }
      }
    }
    ]
  }
};
