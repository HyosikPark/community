const isAuthResolver = {
  Query: {
    async isAuth() {
      const ip = require('ip');
      const clientIp = ip.address();
      const adminIp = ['192.168.124.100', '169.254.76.1'];

      if (adminIp.includes(clientIp)) {
        return true;
      } else {
        throw new Error('not Admin');
      }
    },
  },
};

export default isAuthResolver;
