var webpack = require('webpack');

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
                use: ['style-loader', 'css-loader', 'less-loader'],
                test: /\.less$/,
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery',
            jQuery: 'jquery',
        }),
    ],
};