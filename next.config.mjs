
/** @type {import('next').NextConfig} */
import nextPWA from 'next-pwa';
const withPWA = nextPWA({
  dest: 'public'
})
const nextConfig = withPWA({
  reactStrictMode: true,
  webpack:(config, options) => {
    config.module.rules.push({
      test: /\.(graphql|gql)/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader"
    })
    return config
  }
});

export default nextConfig;
