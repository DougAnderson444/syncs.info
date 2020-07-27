const webpack = require("webpack");
const path = require("path");
const config = require("sapper/config/webpack.js");
const pkg = require("./package.json");
const sapperEnv = require("sapper-environment");

const mode = process.env.NODE_ENV;
const dev = mode === "development";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const alias = { svelte: path.resolve("node_modules", "svelte") };
const extensions = [".mjs", ".js", ".json", ".svelte", ".html"];
const mainFields = ["svelte", "module", "browser", "main"];

const cssConfig = {
  test: /\.(sa|sc|c)ss$/,
  use: [
    "style-loader",
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "sass-loader",
      options: {
        sassOptions: {
          includePaths: ["./src/theme", "./node_modules"],
        },
      },
    },
  ],
};

module.exports = {
  client: {
    entry: config.client.entry(),
    resolve: {
      alias: {
        svelte: path.resolve("node_modules", "svelte"),
        fs: "graceful-fs",
        net: "empty",
      },
      extensions: [".mjs", ".js", ".svelte"],
      mainFields: ["svelte", "browser", "module", "main"],
    },
    output: config.client.output(),
    module: {
      rules: [
        cssConfig,
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: "svelte-loader",
            options: {
              dev,
              hydratable: true,
              hotReload: false, // pending https://github.com/sveltejs/svelte/issues/2377
            },
          },
        },
      ],
    },
    mode,
    plugins: [
      // pending https://github.com/sveltejs/svelte/issues/2377
	  // dev && new webpack.HotModuleReplacementPlugin(),
	  new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/(?!english)/,
        contextRegExp: /bip39\/src\/wordlists$/,
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[name].[id].css",
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require("cssnano"),
        cssProcessorPluginOptions: {
          preset: ["default", { discardComments: { removeAll: true } }],
        },
        canPrint: true,
      }),
      new webpack.DefinePlugin({
        ...sapperEnv(),
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
    ].filter(Boolean),
    devtool: dev && "inline-source-map",
  },

  server: {
    entry: config.server.entry(),
    output: config.server.output(),
    target: "node",
    resolve: { alias, extensions, mainFields },
    externals: Object.keys(pkg.dependencies).concat("encoding"),
    module: {
      rules: [
        cssConfig,
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: "svelte-loader",
            options: {
              css: false,
              generate: "ssr",
              dev,
            },
		  },
		  exclude: ["/node_modules/"],
        },
      ],
    },
	mode: process.env.NODE_ENV,
	plugins: [
		new webpack.IgnorePlugin({
		  resourceRegExp: /^\.\/(?!english)/,
		  contextRegExp: /bip39\/src\/wordlists$/,
		}),
		new MiniCssExtractPlugin({
		  filename: "[name].css",
		  chunkFilename: "[name].[id].css",
		}),
		new OptimizeCssAssetsPlugin({
		  assetNameRegExp: /\.css$/g,
		  cssProcessor: require("cssnano"),
		  cssProcessorPluginOptions: {
			preset: ["default", { discardComments: { removeAll: true } }],
		  },
		  canPrint: true,
		}),
	  ].filter(Boolean),
    performance: {
      hints: false, // it doesn't matter if server.js is large
    },
  },

  serviceworker: {
    entry: config.serviceworker.entry(),
    output: config.serviceworker.output(),
    mode: process.env.NODE_ENV,
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
  },
};
