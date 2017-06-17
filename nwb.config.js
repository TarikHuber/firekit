module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'firekit',
      externals: {
        react: 'React'
      }
    }
  },
  webpack: {
    html: {
      template: 'public/index.html'
    }
  }
}
