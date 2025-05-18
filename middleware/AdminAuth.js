const jwt = require("jsonwebtoken");
let secret = process.env.JWT_SECRET;


module.exports = function (req, res, next) {
  const authToken = req.headers['authorization'];

  if (authToken == undefined) {
    res.status(401).send("Unauthorized");
    return;
  }
  const token = authToken.split(" ")[1];

  try {
    let decoded = jwt.verify(token, secret);
    console.log(decoded);

    if (decoded.role == 1) {
      next();
    } else {
      res.status(403).send("Unauthorized");
      return;
    }

  } catch (err) {
    res.status(401).send("Invalid token");
    return;
  }
  

}