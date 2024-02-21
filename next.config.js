/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '*',
      },
      {
        protocol: 'https',
        hostname: 'gateway.ipfs.io',
        port: '',
        pathname: '*',
      },
      {
        protocol: 'https',
        hostname: 'cf-ipfs.com',
        port: '',
        pathname: '*',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '*',
      },
      {
        protocol: 'https',
        hostname: '10.via0.com',
        port: '',
        pathname: '*',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.cf-ipfs.com',
        port: '',
        pathname: '*',
      },
      {
        protocol: 'https',
        hostname: 'nft-cdn.alchemy.com',
        port: '',
        pathname: '*',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '*',
      },
    ],
  },
  transpilePackages: ['@web3-name-sdk/core'],
  webpack(config) {
    //config.output.webassemblyModuleFilename = './eversdk.wasm';
    config.experiments = { asyncWebAssembly: true, layers: true };
    return config;
  },
  
};

module.exports = nextConfig;
