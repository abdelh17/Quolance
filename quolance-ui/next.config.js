/** @type {import('next').NextConfig} */
const nextConfig = {
  // Specify the directories where ESLint should run
  eslint: {
    dirs: ['src'], // Modify if your source code resides elsewhere
  },

  // Enable React's Strict Mode
  reactStrictMode: true,

  // Use SWC for minification
  swcMinify: true,

  // Uncomment and configure to whitelist specific domains for images
  // This is useful for loading remote images with the Next.js Image component
  // images: {
  //   domains: ['res.cloudinary.com'],
  // },

  // Configuration for image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      },
    ],
  },

  // Unified webpack configuration
  webpack(config) {
    // Add the SVG loader
    config.module.rules.push({
      test: /\.svg$/i, // Match .svg files
      issuer: /\.[jt]sx?$/, // Ensure they are imported in TSX/JSX files
      use: [
        {
          loader: '@svgr/webpack', // Use SVGR loader for React components
          options: {
            typescript: true, // Enable TypeScript support
            icon: true, // Optimize SVGs for icon usage
          },
        },
      ],
    });

    // Add the Babel loader only when NEXT_TEST is set to '1'
    if (process.env.NEXT_TEST === '1') {
      config.module.rules.push({
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["next/babel"],
            plugins: [
              ["istanbul", {
                exclude: ["**/*.cy.tsx"]
              }]
            ]
          }
        }
      });
    }

    return config;
  },
};

module.exports = nextConfig;

 
