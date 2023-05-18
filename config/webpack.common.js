const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
//webpack 查看打包模块依赖关系以及size 插件
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')


module.exports = {
  //指定入口
  entry: {
    main: './src/app/main.js'
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
  ],
  output: {
    //输出文件名称
    filename: '[name].build.js',
    //输出文件路径
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {loader:'style-loader'},
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader"
      },
    ]
  }
};