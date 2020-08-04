const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
  entry: ['./src/main.js'],
  output: {
    filename: 'js/[contenthash:10].js',
    path: resolve(__dirname, '../dist'),
    publicPath: '/' // 所有资源src路径前面都会加上 /
  },
  module: {
    rules: [
      {
        // npm i eslint eslint-loader -D
        // npx install-peerdeps --dev eslint-config-airbnb-base
        test: /\.js$/,
        exclude: /node_modules/, // 排除node_modules
        enforce: 'pre', // 提前执行
        loader: 'eslint-loader',
        options: {
          fix: true, // 自动修复， 一旦出现了eslint报错，自动修复
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/, // 检测文件是否是css文件
        use: [  // 执行顺序：从下到上，从右往左依次执行
          MiniCssExtractPlugin.loader, // 不用style-loader,不用创建一个sytle标签
          'css-loader', // 能将css文件打包到js中（会以commonjs方式整合到js文件中）
          {
            loader: 'postcss-loader',//兼容性添加后缀,还需要在package.json中添加配置
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-preset-env')(),
                require('cssnano')()
              ]
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader, // 不用style-loader,不用创建一个sytle标签
          'css-loader', // 能将css文件打包到js中（会以commonjs方式整合到js文件中）
          {
            loader: 'postcss-loader',//兼容性添加后缀,还需要在package.json中添加配置
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-preset-env')(),
                require('cssnano')()
              ]
            }
          },
          'less-loader' // 将less编译成css文件
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              outputPath: 'images',   //在output基础上，修改输出图片文件的位置
              publicPath: '/images',  //修改背景图引入url的路径
              limit: 8 * 1024,  // 8kb大小以下的图片文件都用base64处理
              name: '[hash:8].[ext]'  // hash值为7位，ext自动补全文件扩展名
            }
          }
        ]
      },
      {
        //打包html中的资源图片
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.(eot|svg|ttf|woff)$/, // 音频视频也可以在这加
        loader: 'file-loader', // 将文件原封不动输出出去
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'media'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          "thread-loader",
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    // js兼容性按需加载： 根据你使用js语法来自动加载兼容性的包
                    useBuiltIns: "usage",
                    corejs: { version: 3, proposals: true },
                    targets: { // 指定兼容性做到哪个版本浏览器
                      ie: 9,
                      chrome: 59,
                      edge: 13,
                      firefox: 50,
                    }
                  }
                ]
              ],
              cacheDirectory: true  // 缓存babel执行结果
            }
          }
        ]
      },

    ]
  },
  plugins: [ // 插件配置
    new HtmlWebpackPlugin({  // Also generate a test.html
      template: './src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    }),
    new VueLoaderPlugin(),
    // new AddAssetHtmlPlugin({ // 能给HtmlWebpackPlugin生成的html文件添加资源（js/css）,这些文件不是main.js中引入的
    //   filepath: require.resolve('./src/js/iconfont.js'),
    //   outputPath: 'js', // 决定文件输出路径
    //   publicPath: 'js', // 决定script.src的文件路径
    // }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[contenthash:10].css",
      chunkFilename: "css/[contenthash:10].css",
      ignoreOrder: false,
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {//source map 更能找到报错的位置
        map: { // 解决source-map不生效问题
          inline: false,
          annotation: true,
        }
      },
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
    })

  ],
  mode: 'production',
  devtool: 'cheap-module-source-map', // 追踪源代码错误
  resolve: {
    alias: { // 配置路径别名
      $css: resolve(__dirname, '../src/css'),
      $less: resolve(__dirname, '../src/less'),
    },
    extensions: [".js", ".json", ".less"] // 自动解析文件扩展名
  },
  // targets: 'web',
  externals: {
    jquery: 'jQuery' // 外部文件，从而不会被webpack打包
  },
  performance: {
    hints: false
  },

}