const Webpack = require('webpack')
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDevMode = process.env.NODE_ENV === "development";

const htmlDirs = ["index", "about"];
let entries = {};
let HTMLPlugins = [];

htmlDirs.forEach((page) => {
  let htmlPlugin = new HtmlWebpackPlugin({
    title: "官网",
    filename: `${page}.html`,
    template: path.resolve(__dirname, `../src/pages/${page}.html`),
    chunks: [page],
  });
  HTMLPlugins.push(htmlPlugin);
  entries[page] = path.resolve(__dirname, `../src/js/${page}.js`);
});

const MiniCssExtractPluginLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: {
    publicPath: "../dist",
  },
};

module.exports = {
  entry: entries, // 入口文件
  output: {
    path: path.resolve(__dirname, "../dist"), // 打包后的目录
    filename: "js/[name].[hash:8].js", // 打包后的文件名称
    chunkFilename: "js/[name].[hash:8].js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: [
          isDevMode ? "style-loader" : MiniCssExtractPluginLoader,
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(jpe?g|png|gif|webp)$/i, //图片文件
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "img/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "media/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/i, // 字体
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "fonts/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // 配置 html 模板
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, "../src/pages/index.html"),
    // }),
    ...HTMLPlugins,
    // 清理 dist 文件夹内残留的上次打包的文件
    new CleanWebpackPlugin(),
    // 把css样式从js文件中提取到单独的css文件中
    new MiniCssExtractPlugin({
      filename: isDevMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: isDevMode ? "[id].css" : "[id].[hash].css",
    }),
    new Webpack.ProvidePlugin({
      $: 'jquery',
    })
  ],
};
