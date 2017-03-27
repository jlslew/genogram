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
            },
        ],
    },
};