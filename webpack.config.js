const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development';
console.log('IS DEV:', isDev);

module.exports = {
    context: path.resolve(__dirname, 'example'),

    mode: 'development',

    entry: {},

    output: {},

    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            test: /\.min\.js$/,
        })],
    },

    devServer: {
        static: {
            directory: path.join(__dirname, 'example'),
        },
        compress: true,
        port: 8000,
        hot: isDev,
        open: true,
    },

    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "example/classes/"),
                    to: path.resolve(__dirname, 'dist/classes/'),
                    globOptions: {
                        dot: true,
                        gitignore: true,
                        ignore: ["**/**.min.js"],
                    },
                },
                {
                    from: path.resolve(__dirname, "example/classes/"),
                    to: path.resolve(__dirname, 'dist/classes/[name].min.js'),
                    globOptions: {
                        dot: true,
                        gitignore: true,
                        ignore: ["**/**.min.js"],
                    },
                },
                {
                    from: path.resolve(__dirname, "example/classes/"),
                    to: path.resolve(__dirname, "example/classes/[name].min.js"),
                    globOptions: {
                        dot: true,
                        gitignore: true,
                        ignore: ["**/**.min.js"],
                    },
                }
            ]
        })
    ],
    module: {
        rules: [
        ]
    }
}