const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const path = require("path");

module.exports = (env, args) => {
  const isProductionMode = (args.mode === "production");

  return {
    entry: "./app/app.tsx",
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript"
              ]
            }
          },
        },
        {
          test: /\.css$/i,
          use: [
            "style-loader",
            "css-loader",
          ],
        },
      ],
    },
    resolve: {
      extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(process.cwd(), "tsconfig.json"),
          extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
        })
      ]
    },
    output: {
        path: path.resolve(__dirname, "..", "server", "www"),
        filename: isProductionMode ? "[name].[contenthash].js" : "[name].[hash].js",
    },
    experiments: {
      asyncWebAssembly: true,
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
        publicPath: "/static",
      },
      hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: "./public/index.html",
          publicPath: isProductionMode ? "/static" : "/"
        }),
        new WasmPackPlugin({
          crateDirectory: path.resolve(__dirname, ".")
        }),
        new ForkTsCheckerWebpackPlugin({
          async: false,
          eslint: {
            files: "./app/**/*",
          },
        })
    ],
  };
}
