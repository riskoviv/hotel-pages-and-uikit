const path = require('path');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const PATHS = {
  dist: path.resolve(__dirname, 'dist'),
  components: path.resolve(__dirname, 'src/components'),
  res: path.resolve(__dirname, 'src/res'),
  src: path.resolve(__dirname, 'src'),
  assets: 'assets',
  pages: 'assets/pages',
  vendor: path.resolve(__dirname, 'src/vendor'),
};

const PAGES_DIR = `${PATHS.src}/pages`;
const PAGES = {};

(function findPugFiles() {
  ['ui-kit', 'website-pages'].forEach((pagesSubdir) => {
    PAGES[pagesSubdir] = fs.readdirSync(`${PAGES_DIR}/${pagesSubdir}`)
      .map((dir) => fs.readdirSync(`${PAGES_DIR}/${pagesSubdir}/${dir}`))
      .reduce((acc, item) => [...acc, ...item], [])
      .filter((filename) => filename.endsWith('.pug'));
  });
}());

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    }
  }

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin(),
    ]
  }

  return config;
};

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash:7].${ext}`;

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true,
      },
    },
    'css-loader',
  ]

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
}

const initHTMLWebpackPlugin = (pagesObj) => {
  const inits = [];
  for (let pagesSubdir in pagesObj) {
    pagesObj[pagesSubdir].forEach((pageName) => {
      inits.push(new HTMLWebpackPlugin({
        template: `${PAGES_DIR}/${pagesSubdir}/${pageName.replace(/\.pug/, '')}/${pageName}`, // .pug
        filename: `${PATHS.pages}/${pageName.replace(/\.pug/, '.html')}`, // .html
        favicon: `${PATHS.res}/images/favicon/favicon.svg`,
      }));
    });
  }
  return inits;
}

const plugins = () => {
  const base = [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      "window.jQuery": 'jquery',
    }),

    new MiniCssExtractPlugin({
      filename: `assets/css/${filename('css')}`,
    }),

    ...initHTMLWebpackPlugin(PAGES),

    new ImageminPlugin({
      disable: isDev,
      minFileSize: 100000,
      pngquant: {quality: '50-50'},
      plugins: [
        imageminMozjpeg({ quality: 50 }),
      ],
    }),
  ]

  return base;
}

module.exports = {
  context: PATHS.src,
  mode: 'development',
  entry: {
    main: './main.js',
  },
  output: {
    filename: filename('js'),
    path: PATHS.dist,
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@vendor': PATHS.vendor,
      '@avatars': `${PATHS.src}/components/form-elements/review/avatars`,
      '@styles': `${PATHS.src}/styles`,
      '@room-cards': `${PATHS.src}/components/cards/room-card/room-cards`,
    },
  },
  optimization: optimization(),
  devServer: {
    contentBase: './dist',
    port: 4200,
    hot: isDev,
    openPage: [
      // `${PATHS.pages}/colors-and-type.html`,
      // `${PATHS.pages}/form-elements.html`,
      // `${PATHS.pages}/cards.html`,
      // `${PATHS.pages}/headers-and-footers.html`,
      `${PATHS.pages}/landing.html`,
      // `${PATHS.pages}/search-room.html`,
      // `${PATHS.pages}/room-details.html`,
      // `${PATHS.pages}/registration-and-sign-in.html`,
    ],
    stats: 'minimal',
  },
  devtool: isDev ? 'source-map' : '',
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: {
          loader: 'pug-loader',
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
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.((pn|jp(e)?)g|gif)$/,
        loader: 'file-loader',
        options: {
          name: filename('[ext]'),
          outputPath: `${PATHS.assets}/img`,
          publicPath: '../img',
        },
      },
      {
        test: /\.([to]tf|woff(2)?|svg)$/,
        loader: 'file-loader',
        options: {
          name: filename('[ext]'),
          outputPath: `${PATHS.assets}/fonts`,
          publicPath: '../fonts',
        },
      },
    ],
  },
};
