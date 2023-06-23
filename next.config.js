/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NFT_STORAGE_TOKEN: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN,
    WEB3_STORAGE_TOKEN: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN,
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
}
