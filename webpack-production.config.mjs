import * as Repack from '@callstack/repack';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import {deps} from './shared/dependencies.mjs';
export default env => {
  const {
    mode = 'development',
    context = Repack.getDirname(import.meta.url),
    entry = './index.js',
    platform = process.env.PLATFORM,
    minimize = mode === 'production',
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = undefined,
    assetsPath = undefined,
    reactNativePath = new URL('./node_modules/react-native', import.meta.url)
      .pathname,
  } = env;
  const dirname = Repack.getDirname(import.meta.url);

  if (!platform) {
    throw new Error('Missing platform');
  }

  process.env.BABEL_ENV = mode;

  return {
    mode,

    devtool: false,
    context,
    entry: [
      ...Repack.getInitializationEntries(reactNativePath, {
        hmr: devServer && devServer.hmr,
      }),
      entry,
    ],
    resolve: {
      ...Repack.getResolveOptions(platform),
      alias: {
        '@components': path.resolve(dirname, './src/components/index'),
        '@constants': path.resolve(dirname, './src/constants/index'),
        '@screens': path.resolve(dirname, './src/screens/index'),
        '@assets': path.resolve(dirname, './src/assets/index'),
        '@styles': path.resolve(dirname, './src/styles/index'),
        '@common': path.resolve(dirname, './src/common/index'),
        '@global': path.resolve(dirname, './src/store/global/index'),
      },
    },
    output: {
      clean: true,
      path: path.join(`${dirname}/build`, 'PackageBundle'),
      chunkFilename: '[name].chunk.bundle',
      publicPath: Repack.getPublicPath({platform, devServer}),
    },
    /**
     * Configures optimization of the built bundle.
     */
    optimization: {
      /** Enables minification based on values passed from React Native CLI or from fallback. */
      minimize,
      /** Configure minimizer to process the bundle. */
      minimizer: [
        new TerserPlugin({
          test: /\.(js)?bundle(\?.*)?$/i,
          /**
           * Prevents emitting text file with comments, licenses etc.
           * If you want to gather in-file licenses, feel free to remove this line or configure it
           * differently.
           */
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
      chunkIds: 'named',
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: [
            /node_modules(.*[/\\])+react/,
            /node_modules(.*[/\\])+@react-native/,
            /node_modules(.*[/\\])+@react-navigation/,
            /node_modules(.*[/\\])+@react-native-community/,
            /node_modules(.*[/\\])+@expo/,
            /node_modules(.*[/\\])+pretty-format/,
            /node_modules(.*[/\\])+metro/,
            /node_modules(.*[/\\])+abort-controller/,
            /node_modules(.*[/\\])+@callstack\/repack/,
            /node_modules(.*[/\\])+@mwg-sdk\/kits/,
            /node_modules(.*[/\\])+rn-fetch-blob/,
            /node_modules(.*[/\\])+@mwg-kits/,
          ],
          use: 'babel-loader',
        },
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              /** Add React Refresh transform only when HMR is enabled. */
              plugins:
                devServer && devServer.hmr
                  ? ['module:react-refresh/babel']
                  : undefined,
            },
          },
        },
        {
          test: Repack.getAssetExtensionsRegExp(Repack.ASSET_EXTENSIONS),
          use: {
            loader: '@callstack/repack/assets-loader',
            options: {
              platform,
              devServerEnabled: Boolean(devServer),
              inline: true,
              scalableAssetExtensions: Repack.SCALABLE_ASSETS,
            },
          },
        },
        {
          test: /\.tsx?$/,
          include: [/node_modules(.*[/\\])+@mwg-sdk/],
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        },
        {
          test: /\.tsx?$/,
          include: [/node_modules(.*[/\\])+@mwg-sdk/],
          use: 'babel-loader',
        },
        {
          test: /\.tsx?$/,
          include: [/node_modules(.*[/\\])+@mwg-kits/],
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        },
        {
          test: /\.tsx?$/,
          include: [/node_modules(.*[/\\])+@mwg-kits/],
          use: 'babel-loader',
        },
        {
          test: /\.tsx?$/,
          use: 'babel-loader',
        },
        {
          test: /\.js?$/,
          use: 'babel-loader',
        },
        {
          test: /\.d.ts?$/,
          use: 'babel-loader',
        },
      ],
    },
    plugins: [
      new Repack.RepackPlugin({
        sourceMaps: mode === 'development',
        context,
        mode,
        platform,
        devServer,
        output: {
          bundleFilename,
          sourceMapFilename,
          assetsPath,
        },
      }),
      //! MAXIMUM COMPRESS
      new CompressionPlugin({
        algorithm: 'gzip',
        deleteOriginalAssets: true,
        filename: '[path][base].gz',
      }),
      new Repack.plugins.ModuleFederationPlugin({
        name: 'LiveStream',
        exposes: {
          './LivestreamProvider': './src/index',
        },
        shared: deps,
      }),
    ],
  };
};
