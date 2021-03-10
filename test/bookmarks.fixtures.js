function makeBookmarksArray() {
    return [
      { id: 1,
        title: 'Facebook',
        url: 'https://www.facebook.com',
        description: 'Social media app for boomers',
        rating: 2 },
      { id: 2,
        title: 'Instagram',
        url: 'https://www.instagram.com',
        description: 'Social media app for millennials',
        rating: 2 },
      { id: 3,
        title: 'TikTok',
        url: 'https://www.tiktok.com',
        description: 'Social media app for genZ',
        rating: 1 },
    ]
  }
  
  module.exports = {
    makeBookmarksArray,
  }