const path = require('path')
const fs = require('fs')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
}

const PAGES_DIR_1 = `${PATHS.src}/pages/ui-kit/`
// const PAGES_DIR_2 = `${PATHS.src}/pages/website-pages/`
const PAGES_1 = fs.readdirSync(PAGES_DIR_1)
  .filter(filename => filename.endsWith('.pug'))
// const PAGES_2 = fs.readdirSync(PAGES_DIR_2)
//   .filter(filename => filename.endsWith('.pug'))

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

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

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
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${PATHS.src}/res/img/`,
          to: './img/'
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),

    ...PAGES_1.map(page => new HTMLWebpackPlugin(
      {
        template: `${PAGES_DIR_1}/${page}`, // .pug
        filename: `./${page.replace(/\.pug/,'.html')}` // .html
      }
    ))

    // ...PAGES_2.map(page => new HTMLWebpackPlugin(
    //   {
    //     template: `${PAGES_DIR_2}/${page}`, // .pug
    //     filename: `./${page.replace(/\.pug/,'.html')}` // .html
    //   }
    // ))
  ]

  return base
}



module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: "./index.js",
    analytics: './analytics.js'
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev
  },
  devtool: isDev ? 'source-map' : '',
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader'
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
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      }
    ]
  }
};
