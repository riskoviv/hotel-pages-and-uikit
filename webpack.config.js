const path = require('path')
const fs = require('fs')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const PATHS = {
  src: path.resolve(__dirname, 'src'),
  res: path.resolve(__dirname, 'src/res'),
  dist: path.resolve(__dirname, 'dist'),
  components: path.resolve(__dirname, 'src/components'),
}

const PAGES_DIR = `${PATHS.src}/pages`
const PAGES = fs.readdirSync(PAGES_DIR)
  .map(dir => fs.readdirSync(`${PAGES_DIR}/${dir}`))
  .reduce((acc, item) => [...acc, ...item], [])
  .filter(filename => filename.endsWith('.pug'))

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin()
    ]
  }

  return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash:7].${ext}`

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      },
    },
    'css-loader'
  ]

  if (extra) {
    loaders.push(extra)
  }

  return loaders
}


const plugins = () => {
  const base = [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      "window.jQuery": 'jquery'
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     // {
    //     //   from: `${PATHS.res}/img`,
    //     //   to: `${PATHS.assets}img`
    //     // }//,
    //     // {
    //     //   from: `${PATHS.res}/fonts`,
    //     //   to: `${PATHS.assets}fonts`
    //     // }
    //   ]
    // }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),

    ...PAGES.map(page => new HTMLWebpackPlugin({
        template: `${PAGES_DIR}/${page.replace(/\.pug/, '')}/${page}`, // .pug
        filename: `./${page.replace(/\.pug/, '.html')}`, // .html
        favicon: `${PATHS.res}/favicon/favicon.svg`
    }))
  ]

  return base
}



module.exports = {
  context: PATHS.src,
  mode: 'development',
  entry: {
    main: "./index.js"
  },
  output: {
    filename: filename('js'),
    path: PATHS.dist,
  },
  resolve: {
    extensions: ['.js', '.json'],
    // alias: {
    //   '@components': path.resolve(__dirname, 'src/components'),
    //   '@': path.resolve(__dirname, 'src')
    // }
  },
  optimization: optimization(),
  devServer: {
    contentBase: './dist',
    port: 4200,
    hot: false,
    openPage: [
      'colors-and-type.html',
      // 'form-elements.html',
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
          }
        }  
      },
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.((pn|jp(e)?|sv)g|ttf|woff(2)?)$/,
        loader: 'file-loader?name=[path]' + filename('[ext]')
      }
      // {
      //   test: /\.(png|jpg|svg|gif)$/,
      //   loader: 'file-loader',
      //   options: {
      //     outputPath: `${PATHS.assets}img`,
      //     name: filename('[ext]')
      //   }
      // },
      // {
      //   test: /\.(ttf|woff(2)?)$/,
      //   loader: 'file-loader',
      //   options: {
      //     outputPath: `${PATHS.assets}fonts`,
      //     publicPath: `${PATHS.assets}fonts`,
      //     name: filename('[ext]')
      //   }
      // }
    ]
  }
};
