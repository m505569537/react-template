const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const lessToJs  = require('less-vars-to-js')

const modifyVars = lessToJs(fs.readFileSync(path.resolve(__dirname, './config/modifyVars.less'), 'utf8'))
module.exports = (env) => {
    console.log('env', env);
    const config = {
        mode: env === 'development' ? 'development' : 'production',
        entry: {
            app: './src/index.js'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: env === 'development' ? 'js/[name].dev.js' : '[name].[chunkhash:8].js',
            chunkFilename: env === 'development' ? 'js/[name].dev.js' : '[name].[chunkhash:8].js'
        },
        devServer: {
            hot: true,
            open: true,
            port: 8080,
            contentBase: './dist',
            compress: true,
            quiet: true
        },
        resolve: {
            extensions: ['.js', '.jsx', '.less']
        },
        module: {
            rules: [
                {
                    test: /\.(css|less)$/,
                    use: [
                        'css-hot-loader',
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                javascriptEnabled: true,
                                sourceMap: true,
                                modifyVars
                            }
                        }
                    ]
                },
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                title: '',
                filename: 'index.html',
                template: 'index.html',
                minify: {
                    removeComments: true,   // 删除注释
                    collapseWhitespace: true,   // 删除空白符号
                    minifyCSS: true  // 压缩内联css
                }
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(env)
            }),
            new MiniCssExtractPlugin({
                filename: env === 'development' ? 'css/[name].dev.css' : '[name].[chunkhash:8].css',
                chunkFilename: env === 'development' ? 'css/[name].dev.css' : '[name].[chunkhash:8].css',
            }),
            new CleanWebpackPlugin()
        ],
        optimization: {
            splitChunks: {
                chunks: 'all',
                name: 'vendor'
            }
        },
        devtool: 'cheap-eval-source-map'
    }
    return config;
}