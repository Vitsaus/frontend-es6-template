var path = require('path');
var stylelint = require('stylelint');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');
var merge = require('webpack-merge');
var stylerules = require('./stylelint.config.js');
var config;

var common = {
    entry: {
        app: [
            'webpack-hot-middleware/client',
            './app/client.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/ },
            { test: /\.css$/, loaders: ['postcss'], exclude: /node_modules/ }
        ],
        loaders: [
            {
                loaders: ['babel'],
                exclude: /node_modules/,
                test: /\.jsx?$/
            },
            {
                  test: /\.scss$/,
                  loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader') },
            { test: /\.json$/, loader: 'json'},
            { test: /\.mp4/, loader: 'url?limit=500&mimetype=video/mp4&name=./videos/[name].[ext]' },
            { test: /\.svg/, loader: 'url?limit=500&mimetype=image/svg+xml&name=./images/[name].[ext]' },
            { test: /\.png$/, loader: 'url?limit=500&mimetype=image/png&name=./images/[name].[ext]' },
            { test: /\.jpg/, loader: 'url?limit=500&mimetype=image/jpeg&name=./images/[name].[ext]' },
            { test: /\.gif/, loader: 'url?limit=500&mimetype=image/gif&name=./images/[name].[ext]' },
            { test: /\.(otf|eot|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=1000&name=./fonts/[name].[ext]' }
        ],
    },
    resolve: {
        extensions: [
            '', '.js', '.css'
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['build'], {
            root: __dirname,
            verbose: true,
            dry: false
        }),
        new ExtractTextPlugin('css/main.css', {
            allChunks: false
        }),
        new HtmlWebpackPlugin({
            template: 'html!./app/index.html',
            inject: 'body'
        })
    ],
    postcss: function () {
        return [stylelint(stylerules)];
    },
    eslint: {
        fix: true,
        failOnWarning: false,
        failOnError: true
    }
};

switch(process.env.npm_lifecycle_event) {
    case 'start':
        config = merge(common, {
            watchOptions: {
                // Delay the rebuild after the first change
                aggregateTimeout: 300,
                // Poll using interval (in ms, accepts boolean too)
                poll: 1000
            },
            devServer: {
                host: '0.0.0.0',
                port: 4000,
                contentBase: 'build/',
                historyApiFallback: true,
                hot: true,
                inline: true
            },
            devtool: 'source-map'
        });
        config.plugins.push(
            new webpack.HotModuleReplacementPlugin({
                multiStep: true
            })
        );
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"development"'
                }
            })
        );
        break;
    case 'build':
        config = merge(common, {
            devtool: 'eval-source-map',
            entry: {
                app: './app/main.js'
            }
        });
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"development"'
                }
            })
        );
        break;
    case 'build-min':
        config = merge(common, {
            devtool: 'eval-source-map',
            entry: {
                app: './app/main.js'
            }
        });
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                minimize: true,
                compress: {
                    warnings: false
                }
            })
        );
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            })
        );
        break;
    default:
        config = merge(common, {});
}

module.exports = config;
