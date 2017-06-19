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
      template: 'demo/public/index.html'
    }
  }
}
