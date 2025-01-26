// @ts-check

const isProduction = process.env.NODE_ENV === "production";

const bundleAnalyzer = process.env.npm_config_argv?.includes(
  "build:bundle-analyzer"
);

const webpack = require("webpack");

/**
 * @type {import("next").NextConfig}
 * */
const nextConfig = {
  transpilePackages: [
    "@farcaster/frame-sdk",
    "@farcaster/frame-wagmi-connector",
  ],
  compiler: {
    reactRemoveProperties: isProduction,
    removeConsole: isProduction,
    styledComponents: {
      displayName: false,
      fileName: false,
      minify: isProduction,
      pure: true,
      ssr: true,
      transpileTemplateLiterals: true,
    },
  },
  devIndicators: {
    buildActivityPosition: "top-right",
  },
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        const mod = resource.request.replace(/^node:/, "");

        switch (mod) {
          case "buffer":
            resource.request = "buffer";
            break;
          case "stream":
            resource.request = "readable-stream";
            break;
          case "crypto":
            resource.request = "crypto-browserify";
            break;
          case "async_hooks":
            resource.request = "async_hooks-browserify";
            break;
          default:
            throw new Error(`Not found ${mod}`);
        }
      }),
      new webpack.DefinePlugin({
        __REACT_DEVTOOLS_GLOBAL_HOOK__: "({ isDisabled: true })",
      })
    );

    config.resolve.fallback = {
      ...config.resolve.fallback,
      module: false,
      perf_hooks: false,
      crypto: require.resolve("crypto-browserify"),
      fs: false,
      path: false,
      stream: require.resolve("stream-browserify"),
      async_hooks: false,
    };

    config.module.parser.javascript = config.module.parser.javascript || {};
    config.module.parser.javascript.dynamicImportFetchPriority = "high";

    return config;
  },
};

module.exports = bundleAnalyzer
  ? require("@next/bundle-analyzer")({
      enabled: isProduction,
    })(nextConfig)
  : nextConfig;
