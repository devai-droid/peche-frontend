/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { merge } = require("webpack-merge")
const common = require("./webpack.common")
const path = require("path")

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  ignoreWarnings: [/Deprecation/],
  devServer: {
    open: true,
    hot: true,
    compress: true,
    port: 8086,
    historyApiFallback: true,
    liveReload: true,
    allowedHosts: "all",
    proxy: {
      "/api": {
        target: "http://localhost:3007",
        changeOrigin: true,
      },
    },
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        exclude: /node_modules/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: /\.module\.\w+$/i,
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
            },
          },
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                silenceDeprecations: ["legacy-js-api", "import", "global-builtin"],
              },
            },
          },
          {
            loader: "sass-resources-loader",
            options: {
              resources: "./src/design-system/styles/index.scss",
            },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        include: /node_modules/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                silenceDeprecations: ["legacy-js-api", "import", "global-builtin"],
              },
            },
          },
        ],
      },
    ],
  },
})
