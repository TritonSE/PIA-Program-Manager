/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

// module.exports = {
//   output: "export",
//   images: {
//     unoptimized: true,
//   },
//   webpack: (config, { dev, isServer }) => {
//     // Add a custom rule for JSON files
//     config.module.rules.push({
//       test: /\.json$/,
//       use: [
//         {
//           loader: 'file-loader',
//           options: {
//             name: 'json/[name].[hash:8].[ext]',
//           },
//         },
//       ],
//     });

//     return config;
//   },
// };
