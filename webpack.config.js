const path = require('path');
const glob = require('glob');
const postcss = require('postcss');
const ExtractCSS = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// Build out the list of template script entry points for template specific scripts
const templateEntries = glob.sync('./src/scripts/templates/**.js').reduce((obj, el) => {
  obj[path.parse(el).name] = el;
  return obj;
}, {});


module.exports = {
  entry: {
    ...templateEntries,
    'layout': './src/scripts/layouts/layout.js'
  },
  output: {
    filename: '[name].build.js',
    path: path.resolve(__dirname, 'dist/assets')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: [
          ExtractCSS.loader,
          require.resolve('css-loader'),
          {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-import'),
                  require('tailwindcss'),
                  require('postcss-nested'),
                  require('postcss-preset-env')({
                    // Fixes a build error due to older PostCSS version
                    stage: 1,
                    features: {
                      'focus-within-pseudo-class': false
                    }
                  }),
                  require('autoprefixer')
                ]
              }
            }
          }
        ]
      },
    ]
  },
  resolve: {
    alias: {
      scripts: path.resolve(__dirname, 'src/scripts/'),
      apps: path.resolve(__dirname, 'src/apps/'),
    },
  },
  plugins: [
    new ExtractCSS({
      filename: 'theme.css'
    })
  ],
  mode: 'development'
}