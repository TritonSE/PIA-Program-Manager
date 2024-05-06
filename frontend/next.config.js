/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,

  // https://react-svgr.com/docs/next/
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
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
