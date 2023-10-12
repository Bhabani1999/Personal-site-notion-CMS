export default function manifest() {
    return {
      name: 'Bhabani SM',
      short_name: 'Bhabani SM',
      description: 'Repository of work and notes of Bhabani SM',
      start_url: '/',
      display: 'standalone',
      background_color: '#1E1E1E',
      theme_color: '#1E1E1E',
      icons: [
        {
          src: '/favicon.ico',
          sizes: 'any',
          type: 'image/x-icon',
        },
      ],
    }
  }