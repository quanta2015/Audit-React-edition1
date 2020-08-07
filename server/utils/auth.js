var jwt = require('jsonwebtoken') 

auth = (req, res, next) => {
  const header = req.headers.authorization
  let token

  if (header) token = header.split(' ')[1]
  if (token) {
    jwt.verify(token, 'MOOC_SECRET', (err, decoded) => {
      if (err) {
        res.status(500).json({
          code: -1,
          msg: 'Invalid token',
        })
      } else {
        console.log('decoded'+ JSON.stringify(decoded))
          // req.currentUser = user
          next()
      }
    })
  } else {
    res.status(500).json({
      code: -1,
      msg: 'No token',
    })
  }
}

module.exports = auth;
