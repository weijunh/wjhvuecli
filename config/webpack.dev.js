const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
  entry: ['./src/main.js', './src/index.html'],
  output: {
    filename: './js/index.js',
    path: resolve(__dirname, '../dist')
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
          'style-loader', // 创建style标签，将js中的css代码放进标签内生效
          'css-loader', // 能将css文件打包到js中（会以commonjs方式整合到js文件中）
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader', // 创建style标签，将js中的css代码放进标签内生效
          'css-loader', // 能将css文件打包到js中（会以commonjs方式整合到js文件中）
          'less-loader' // 将less编译成css文件
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              outputPath: 'images/',   //在output基础上，修改输出图片文件的位置
              publicPath: 'images/',  //修改背景图引入url的路径
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
      template: './src/index.html'
    }),
    new VueLoaderPlugin()
    // new AddAssetHtmlPlugin({ // 能给HtmlWebpackPlugin生成的html文件添加资源（js/css）,这些文件不是main.js中引入的
    //   filepath: require.resolve('./src/js/iconfont.js'),
    //   outputPath: 'js', // 决定文件输出路径
    //   publicPath: 'js', // 决定script.src的文件路径
    // }),
  ],
  mode: 'development',
  // npm i webpack-dev-server -D
  devServer: { // 开启一个服务器来运行构建后的代码
    contentBase: resolve(__dirname, "../dist"), // 运行代码的路径
    compress: true, // 启动gzip压缩
    port: 3000, // 端口号
    open: true, // 自动打开浏览器
    hot: true, // 开启模块热替换功能
  },
  devtool: 'cheap-module-eval-source-map', // 追踪源代码错误
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
  }
}