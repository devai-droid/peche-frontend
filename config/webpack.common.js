/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const webpack = require("webpack")
const dotenv = require("dotenv")
const ESLintPlugin = require("eslint-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

const stage = process.env.STAGE || "dev"
dotenv.config({ path: `env/.env.${stage}` })

module.exports = {
  entry: `${path.resolve(__dirname, "../src")}/index.tsx`,
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: "preset-default",
                    params: {
                      overrides: {
                        removeViewBox: false,
                      },
                    },
                  },
                ],
              },
            },
          },
          "url-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|pdf|webp)$/,
        type: "asset",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${path.resolve(__dirname, "../public")}/index.html`,
      // favicon: `${path.resolve(__dirname, "../public")}/favicon.ico`,
    }),
    new webpack.ProvidePlugin({
      React: "react",
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
    new CopyPlugin({
      patterns: [
        { from: "public/robots.txt", to: "robots.txt" },
        { from: "public/manifest.json", to: "manifest.json" },
        { from: "public/favicon.ico", to: "favicon.ico" },
        { from: "public/favicon-32x32.png", to: "favicon-32x32.png" },
        { from: "public/favicon-16x16.png", to: "favicon-16x16.png" },
      ],
    }),
    new ESLintPlugin({
      // Plugin options
      extensions: ["js", "jsx", "ts", "tsx"],
      emitError: true,
      emitWarning: true,
      failOnError: false,
      failOnWarning: false,
      useEslintrc: true,
      cache: true,
    }),
    new ForkTsCheckerWebpackPlugin({
      issue: {
        exclude: [
          {
            file: "**/src/lib/orval/**/*",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
    extensions: [
      "",
      ".js",
      ".ts",
      ".jsx",
      ".tsx",
      ".css",
      ".scss",
      ".json",
      ".svg",
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
    ],
  },
}
