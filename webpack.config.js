const path = require('path');
const entry = require('webpack-glob-entry');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';
const stylesHandler = 'style-loader';

const entryObject = entry('./src/js/*');
delete entryObject['utils'];
Object.keys(entryObject).forEach(entryKey => entryObject[entryKey] = `${entryObject[entryKey]}/index.js`);

const entryStyleObject = entry('./src/scss/*');
delete entryStyleObject['utils'];
Object.keys(entryStyleObject).forEach(entryKey => entryObject[entryKey] = entryStyleObject[entryKey]);

const config = {
    entry: entryObject,
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: `[name].js`
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                type: 'asset/resource',
                generator: {
                    filename: (file) => {
                        const folders = file.filename.split('/')
                        const fileName = folders[folders.length - 1].split(".")[0]

                        return fileName + '.css'
                    },
                },
                use: [
                    // stylesHandler,
                    // 'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                parallel: true,
            }),
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    mangle: true,
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
    plugins: [
        new FixStyleOnlyEntriesPlugin({ extensions: ['scss'] }),
        new NodePolyfillPlugin(),
    ],
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';

    } else {
        config.mode = 'production';
    }

    return config;
};
