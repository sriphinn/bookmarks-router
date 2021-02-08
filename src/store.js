const { v4: uuid } = require('uuid')

const bookmarks = [
  { id: uuid(),
    title: 'Facebook',
    url: 'https://www.facebook.com',
    description: 'Social media app for boomers',
    rating: 2 },
  { id: uuid(),
    title: 'Instagram',
    url: 'https://www.instagram.com',
    description: 'Social media app for millennials',
    rating: 2 },
  { id: uuid(),
    title: 'TikTok',
    url: 'https://www.tiktok.com',
    description: 'Social media app for genZ',
    rating: 1 },
]

module.exports = { bookmarks }