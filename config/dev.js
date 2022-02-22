module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {},
  weapp: {
    module: {
      postcss: {
        url: {
          enable: true,
          config: {
            limit: 10240, // 文件大小限制
          },
        },
      },
    },
  },
  mini: {},
  h5: {},
};
