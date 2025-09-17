// // Load configuration from environment or config file

// const path = require('path');

// // Environment variable overrides
// const config = {
//   disableHotReload: process.env.DISABLE_HOT_RELOAD,
// };

// module.exports = {
//   webpack: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//     },
//     configure: (webpackConfig) => {
      
//       // Disable hot reload completely if environment variable is set
//       if (config.disableHotReload) {
//         // Remove hot reload related plugins
//         webpackConfig.plugins = webpackConfig.plugins.filter(plugin => {
//           return !(plugin.constructor.name === 'HotModuleReplacementPlugin');
//         });
        
//         // Disable watch mode
//         webpackConfig.watch = false;
//         webpackConfig.watchOptions = {
//           ignored: /.*/, // Ignore all files
//         };
//       } else {
//         // Add ignored patterns to reduce watched directories
//         webpackConfig.watchOptions = {
//           ...webpackConfig.watchOptions,
//           ignored: [
//             '**/node_modules/**',
//             '**/.git/**',
//             '**/build/**',
//             '**/dist/**',
//             '**/coverage/**',
//             '**/public/**',
//           ],
//         };
//       }
      
//       return webpackConfig;
//     },
//   },
// };


// craco.config.js

const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (webpackConfig) => {
      // Keep watch optimizations
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/build/**",
          "**/dist/**",
          "**/coverage/**",
          "**/public/**",
        ],
      };

      return webpackConfig;
    },
  },

  devServer: (devServerConfig) => {
    return {
      ...devServerConfig,
      client: {
        ...devServerConfig.client,
        webSocketURL: {
          protocol: "ws",        // force WS not WSS
          hostname: "localhost", // your dev host
          port: 3000,            // match your dev server port (CRA default)
        },
      },
    };
  },
};
