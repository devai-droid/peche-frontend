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
        // IndexNow 공개 키 (네이버·Bing 색인 즉시 통보용) — 사이트 루트에 호스팅
        { from: "public/9f26df7c8f4d2d0ea8ddf7ac5da0dd82.txt", to: "9f26df7c8f4d2d0ea8ddf7ac5da0dd82.txt" },
        // 네이버 서치어드바이저 사이트 소유확인 파일
        { from: "public/naver85b69026b0142a2c09f1a5a53d3d24e9.html", to: "naver85b69026b0142a2c09f1a5a53d3d24e9.html" },
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
