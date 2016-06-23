var path = require('path');
var stylelint = require('stylelint');
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
            './app/main.js'
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
            { test: /\.css$/, loaders: ['postcss'] }
        ],
        loaders: [
            {
                loaders: ['babel'],
                exclude: /node_modules/,
                test: /\.jsx?$/
            },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader') },
            { test: /\.json$/, loader: 'json'},
            { test: /\.mp4/, loader: 'url?limit=500&mimetype=video/mp4&name=./videos/[name].[ext]' },
            { test: /\.svg/, loader: 'url?limit=500&mimetype=image/svg+xml&name=./misc/[name].[ext]' },
            { test: /\.png$/, loader: 'url?limit=500&mimetype=image/png&name=./images/[name].[ext]' },
            { test: /\.jpg/, loader: 'url?limit=500&mimetype=image/jpeg&name=./images/[name].[ext]' },
            { test: /\.gif/, loader: 'url?limit=500&mimetype=image/gif&name=./images/[name].[ext]' },
            { test: /\.(otf|eot|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=1000&name=./misc/[name].[ext]' }
        ],
    },
    resolve: {
        extensions: [
            '', '.js', '.css'
        ]
    },
    plugins: [
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
        fix: true
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
                port: 3000,
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
            devtool: 'eval-source-map'
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
            devtool: 'eval-source-map'
        });
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                comments: false,
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
