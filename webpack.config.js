var webpack = require('webpack'), ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: __dirname + '/build',
        filename: 'assets/[name].js',
        chunkFilename: 'assets/chunk.[id].js',
    },
    module: {
        rules: [
            {
                use: ['file-loader?name=[name].[ext]'],
                test: /\.html$/,
            }, {
                use: ['file-loader?name=assets/[name].[ext]'],
                test: /\.(ttf|otf|eot|svg|woff(2)?)$/,
            }, {
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'less-loader'],
                    fallback: 'style-loader',
                    publicPath: '../',
                }),
                test: /\.less$/,
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery',
            jQuery: 'jquery',
        }),
        new ExtractTextPlugin({
            filename: 'assets/styles.css',
            allChunks: true,
        }),
    ],
};