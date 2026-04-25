export default {
  server: {
    proxy: {
      '/kc': {
        target: 'https://id.tif.uin-suska.ac.id',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/kc/, '')
      }
    }
  }
}