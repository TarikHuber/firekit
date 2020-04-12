module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    umd: false,
  },
  webpack: {
    html: {
      template: "demo/public/index.html",
    },
  },
};
