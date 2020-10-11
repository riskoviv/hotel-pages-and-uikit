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
  assets: 'assets',
  dist: path.resolve(__dirname, 'dist'),
  components: path.resolve(__dirname, 'src/components'),
  res: path.resolve(__dirname, 'src/res'),
  src: path.resolve(__dirname, 'src'),
};

const PAGES_DIR = `${PATHS.src}/pages`;
const PAGES_ARR = [];

for (let pages_subdir of ['ui-kit',]) {
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
      minSize: 1,
      minChunks: 2,
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
      filename: `./${page.pageName.replace(/\.pug/, '.html')}`, // .html
      favicon: `${PATHS.res}/images/favicon/favicon.svg`,
      chunks: [`${page.pageName.replace(/\.pug/, '')}`, 'common'],
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
    common: './pages/common/common.js',
    'colors-and-type': './pages/ui-kit/colors-and-type/colors-and-type.js',
    'form-elements': './pages/ui-kit/form-elements/form-elements.js',
    'cards': './pages/ui-kit/cards/cards.js',
    'headers-and-footers': './pages/ui-kit/headers-and-footers/headers-and-footers.js',
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
      // 'colors-and-type.html',
      // 'form-elements.html',
      // 'cards.html',
      'headers-and-footers.html',
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
            root: PATHS.components
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
          outputPath: `${PATHS.assets}/img`,
          name: filename('[ext]'),
        },
      },
      {
        test: /\.(ttf|woff(2)?|svg)$/,
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
