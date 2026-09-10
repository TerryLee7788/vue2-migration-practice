const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      // Vue 2 with the runtime + compiler build so in-DOM templates work.
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  // vue-loader 15 對 scoped <style> 會產生無害的 "style0 not found" 警告，
  // 樣式仍會由 style-loader 正常注入，這裡直接忽略以保持輸出乾淨。
  ignoreWarnings: [/export 'default'.*was not found/],
  devServer: {
    static: path.resolve(__dirname, 'public'),
    port: 8080,
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: { errors: true, warnings: false }
    }
  }
}
