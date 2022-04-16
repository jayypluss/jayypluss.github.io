import * as path from 'path'
import * as fs from 'fs'
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const Dotenv = require('dotenv-webpack')

// App directory
const appDirectory = fs.realpathSync(process.cwd())

module.exports = {
  entry: path.resolve(appDirectory, "src/index.ts"),
  output: {
    filename: "js/babylonBundle.js",
    path: path.resolve("./dist/"),
  },
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {
      fs: false,
      path: false, // require.resolve("path-browserify")
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        loader: "source-map-loader",
        enforce: "pre",
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        // sideEffects: true
      },
      {
        test: /\.(png|jpg|gif|env|glb|stl)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(appDirectory, "src/index.html"),
    }),
    new Dotenv()
  ],
}
