module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.(tsx|ts)$/,
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts"],
  }
}
