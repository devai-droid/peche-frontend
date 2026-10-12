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

// src 에서 process.env.* 로 읽는 값만 허용
const PUBLIC_ENV_KEYS = [
  "NODE_ENV",
  "STAGE",
  "BACKEND_API_URL",
  "DISTRIBUTION_URL",
  "KAKAO_APP_REST_KEY",
  "KAKAO_APP_JAVASCRIPT_KEY",
  "BLOG_V2_API_URL",
  "B2B_MODE",
]

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
      // 번들에 넣을 환경변수만 골라 넣는다(빌드 PC의 다른 환경변수·토큰이 공개 번들에 섞이지 않도록)
      "process.env": JSON.stringify(
        Object.fromEntries(
          PUBLIC_ENV_KEYS.filter((key) => process.env[key] !== undefined).map((key) => [
            key,
            process.env[key],
          ]),
        ),
      ),
    }),
    new CopyPlugin({
      patterns: [
        { from: "public/robots.txt", to: "robots.txt" },
        { from: "public/manifest.json", to: "manifest.json" },
        { from: "public/favicon.ico", to: "favicon.ico" },
        { from: "public/favicon-32x32.png", to: "favicon-32x32.png" },
        { from: "public/favicon-16x16.png", to: "favicon-16x16.png" },
        // IndexNow 공개 키 (네이버·Bing 색인 즉시 통보용) — 사이트 루트에 호스팅
        {
          from: "public/9f26df7c8f4d2d0ea8ddf7ac5da0dd82.txt",
          to: "9f26df7c8f4d2d0ea8ddf7ac5da0dd82.txt",
        },
        // 네이버 서치어드바이저 사이트 소유확인 파일
        {
          from: "public/naver85b69026b0142a2c09f1a5a53d3d24e9.html",
          to: "naver85b69026b0142a2c09f1a5a53d3d24e9.html",
        },
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
