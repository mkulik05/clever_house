var fs  = require('fs')
function check(req) {
      var conf = fs.readFileSync("./config.json")    
      conf = JSON.parse(conf)
      if (conf.allowed.includes(req.variables.token)) {
            return 1
      } else {
            return 0;
      }
}

export default {check};