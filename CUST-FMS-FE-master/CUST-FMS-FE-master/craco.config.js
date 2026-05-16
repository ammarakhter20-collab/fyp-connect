// webpack.config.js or webpack.config.prod.js

module.exports = {
  // Other webpack configurations...
  webpack: {
    configure: (webpackConfig) => {
      // Add stream-browserify fallback
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        stream: require.resolve("stream-browserify"),
        // Add crypto-browserify fallback
        crypto: require.resolve("crypto-browserify"),
        vm: false,
      };

      // Exclude node_modules from source-map-loader
      webpackConfig.module.rules.push({
        test: /\.ts$/,
        enforce: "pre",
        loader: "ignore-loader",
        exclude: /node_modules\/flowbite\/src\/components\/accordion/,
      });

      return webpackConfig;
    },
  },
};
