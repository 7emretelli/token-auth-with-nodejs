const JWT = require("jsonwebtoken");

function tokenAuth(req, res, next) {
  const authToken = req.headers["authorization"];
  if (authToken == null) return res.json({ message: "Access denied" });

  JWT.verify(authToken, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user["id"];
    next();
  });
}

module.exports = tokenAuth;
