module.exports = {
  images: {
    domains: [
      'i.imgur.com',
      'images.unsplash.com',
      // Notion-hosted file images
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      's3.us-west-2.amazonaws.com',
    ],
  },
  async headers() {
    return [
      {
        // Work assets are stable in production, so cache them for a year. In
        // development they must revalidate, or edited assets never refresh.
        source: '/work/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'production'
              ? 'public, max-age=31536000, immutable'
              : 'no-cache',
          },
        ],
      },
      {
        // next/font emits hashed filenames, so these are safe to cache forever.
        source: '/_next/static/media/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};
