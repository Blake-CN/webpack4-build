'use strict';

const fs = require('fs');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require('./index.js');
const entry = require('./module/entry');

const webpackConf = {
  mode: config.NODE_ENV,
  entry: null,
  target: 'web',
  output: {
    path: path.join(config.workingPath, config.development_dist),
    filename: '[name].js'
  },
  resolve: {
    modules: [path.join(config.root, 'node_modules'), path.join(config.workingPath, 'node_modules'), 'node_modules'],
    // alias: {
    //   vue$: config.NODE_ENV === 'production' ? 'vue/dist/vue.min.js' : 'vue/dist/vue.js',
    // },
    // extensions: ['.wasm', '.mjs', '.js', '.json', '.vue'],
    symlinks: true
  },
  resolveLoader: {
    modules: [path.join(config.root, 'node_modules'), path.join(config.workingPath, 'node_modules'), 'node_modules']
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader
      }, 'css-loader']
    }, {
      test: /\.(png|jpe?g|gif|svg)$/,
      use: [{
        loader: 'url-loader',
        options: {
          name: 'img/[name].[ext]'
        }
      }]
    }, {
      //   test: /\.(shtml|html)$/,
      //   use: ['html-loader']
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
  ]
};

webpackConf.entry = entry;

webpackConf.plugins.unshift(
  new CleanWebpackPlugin([path.join(config.workingPath, config.development_dist)], {
    root: config.workingPath,
    verbose: true, // 是否在控制台输出信息
    dry: false // 启用删除文件
  })
);
// 复制html
config.pages.forEach((page) => {
  webpackConf.plugins.push(new HtmlWebpackPlugin({
    template: path.join(config.workingPath, 'src', page, page + '.html'),
    filename: `${page}.shtml`,
    inject: 'head' // 链接插入位置
  }));
});

module.exports = webpackConf;