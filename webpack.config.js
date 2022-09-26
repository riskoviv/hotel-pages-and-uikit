import { resolve as _resolve } from 'path';
import { readdirSync } from 'fs';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import ImageminWebpackPlugin from 'imagemin-webpack-plugin';
import imageminMozjpeg from 'imagemin-mozjpeg';

const ImageminPlugin = ImageminWebpackPlugin.default;

const PATHS = {
  dist: _resolve('dist'),
  components: _resolve('src/components'),
  res: _resolve('src/res'),
  src: _resolve('src'),
  assets: 'assets',
  pages: 'assets/pages',
  vendor: _resolve('src/vendor'),
};

const PAGES_DIR = `${PATHS.src}/pages`;
const PAGES = {};

['ui-kit', 'website-pages', 'index/..'].forEach((pagesSubDir) => {
  PAGES[pagesSubDir] = readdirSync(`${PAGES_DIR}/${pagesSubDir}`)
    .flatMap((dir) => readdirSync(`${PAGES_DIR}/${pagesSubDir}/${dir}`))
    .filter((filename) => filename.endsWith('.pug'));
});

const initHTMLWebpackPlugin = (pagesObj) => {
  const inits = [];
  Object.entries(pagesObj).forEach(([subDirName, pageNames]) => {
    pageNames.forEach((pageName) => {
      inits.push(new HTMLWebpackPlugin({
        template: `${PAGES_DIR}/${subDirName}/${pageName.replace(/\.pug/, '')}/${pageName}`, // pug source
        filename: `${PATHS.pages}/${pageName.replace(/\.pug/, '.html')}`, // html result
        favicon: `${PATHS.res}/images/favicon/favicon.svg`,
      }));
    });
  });
  return inits;
};

const getConfig = (isDev) => {
  const isProd = !isDev;

  const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[fullhash:5].${ext}`);

  const cssLoaders = (extra) => {
    const loaders = [
      MiniCssExtractPlugin.loader,
      'css-loader',
    ];

    if (extra) {
      loaders.push(extra);
    }

    return loaders;
  };

  const config = {
    context: PATHS.src,
    mode: 'development',
    entry: {
      main: './main.js',
    },
    output: {
      filename: filename('js'),
      assetModuleFilename: '[name][ext]',
      path: PATHS.dist,
      clean: true,
    },
    resolve: {
      alias: {
        '@vendor': PATHS.vendor,
        '@styles': `${PATHS.src}/styles`,
      },
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin(),
      ],
    },
    devServer: {
      static: './dist',
      port: 4201,
      hot: false,
      open: `${PATHS.pages}/index.html`,
    },
    stats: 'minimal',
    devtool: isDev ? 'source-map' : false,
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      }),

      new MiniCssExtractPlugin({
        filename: `assets/css/${filename('css')}`,
      }),

      ...initHTMLWebpackPlugin(PAGES),

      new ImageminPlugin({
        disable: isDev,
        minFileSize: 100000,
        pngquant: { quality: '50-50' },
        plugins: [
          imageminMozjpeg({ quality: 50 }),
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: {
            loader: 'simple-pug-loader',
            options: {
              root: PATHS.components,
            },
          },
        },
        {
          test: /\.css$/,
          use: cssLoaders(),
        },
        {
          test: /\.scss$/,
          use: cssLoaders('sass-loader'),
        },
        {
          test: /\.((pn|jp(e)?)g|gif)$/,
          type: 'asset/resource',
          generator: {
            outputPath: 'assets/img/',
            publicPath: 'assets/img/',
          },
        },
        {
          test: /\.([to]tf|woff(2)?|svg)$/,
          type: 'asset/resource',
          generator: {
            outputPath: 'assets/fonts/',
            publicPath: 'assets/fonts/',
          },
        },
      ],
    },
  };
  return config;
};

export default (env, argv) => {
  let isDev = true;
  if (argv.mode === 'production') {
    isDev = false;
  }

  return getConfig(isDev);
};
