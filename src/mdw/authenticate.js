const { redis } = require('../db/init');

const authenticate = (req, res, next) => {
  const { username, token } = req.body;

  const usertokenkey = username + "_" + "authtoken";
  redis.get(usertokenkey, (err, data) => {
    if(!err) {
      //Ohhhhhhh man if I didn't check if data wasn't false first...
      //Think of those hacks...
      if(data && data === token) {
        next();
      } else {
        res.send({status: 400, message: 'Not authenticated'})
      }
    } else {
      console.log(err);
      res.send({status: 500, message: 'Internal Server Error'})
    }
  });
}

module.exports = authenticate
