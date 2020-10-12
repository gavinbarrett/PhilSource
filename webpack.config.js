module.exports = {
	entry: './src/App.jsx',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					{ 
						loader: 'style-loader'
					},
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.(png|jpg)$/,
				loader: 'url-loader',
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	output: {
		filename: 'bundle.js',
		path: __dirname + '/dist',
	},
};
