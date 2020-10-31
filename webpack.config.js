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
};

const PAGES_DIR = `${PATHS.src}/pages`;
const PAGES_ARR = [];

for (let pages_subdir of ['ui-kit', 'website-pages']) {
  const PAGES = fs.readdirSync(`${PAGES_DIR}/${pages_subdir}`)
    .map(dir => fs.readdirSync(`${PAGES_DIR}/${pages_subdir}/${dir}`))
    .reduce((acc, item) => [...acc, ...item], [])
    .filter(filename => filename.endsWith('.pug'));
  for (let page of PAGES) {
    PAGES_ARR.push({pagesGroup: pages_subdir, pageName: page});
  }
}

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
    
    ...PAGES_ARR.map(page => new HTMLWebpackPlugin({
      template: `${PAGES_DIR}/${page.pagesGroup}/${page.pageName.replace(/\.pug/, '')}/${page.pageName}`, // .pug
      filename: `${PATHS.pages}/${page.pageName.replace(/\.pug/, '.html')}`, // .html
      favicon: `${PATHS.res}/images/favicon/favicon.svg`,
      chunks: [`${page.pageName.replace(/\.pug/, '')}`, `${page.pagesGroup}-common`],
    })),

    new ImageminPlugin({
      disable: isDev,
      minFileSize: 100000,
      pngquant: {quality: '50-50'},
      plugins: [
        imageminMozjpeg({quality: 50}),
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
  },
  optimization: optimization(),
  devServer: {
    contentBase: './dist',
    port: 4200,
    hot: false,
    openPage: [
      // `${PATHS.pages}/colors-and-type.html`,
      // `${PATHS.pages}/form-elements.html`,
      // `${PATHS.pages}/cards.html`,
      // `${PATHS.pages}/headers-and-footers.html`,
      // `${PATHS.pages}/landing.html`,
      // `${PATHS.pages}/search-room.html`,
      `${PATHS.pages}/room-details.html`,
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
