YARN_IGNORE_NODE=1 yarn react-native webpack-bundle --platform ios --webpackConfig webpack-production.config.mjs --entry-file index.js --dev=false && cd build && zip -r PackageBundle.zip PackageBundle