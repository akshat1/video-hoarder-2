const httpProxy = require("http-proxy");
const proxy = httpProxy.createServer({ target: "http://localhost:4000" });

module.exports = {
  "mount": {
    "src/client": "/",
    "src/common": "/common/",
  },
  routes: [{
    src: "/api/.*",
    dest: (req, res) => proxy.web(req, res),
  }],
};
