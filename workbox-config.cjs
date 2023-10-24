module.exports = {
    globDirectory: 'dist', // Adjust to match your build output directory
    globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}'], // Adjust file extensions as needed
    swSrc: "./public/service-worker.js", // Path to your service worker template file
    swDest: "./dist/service-worker.js", // Path where the service worker should be generated
  };