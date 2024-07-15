const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
   try {

      const accessToken = req.header("Authorization");

      if (!accessToken) {
         return res.status(401).json({ msg: "No authentication token, authorization denied," });
      }

      const verified = jwt.verify(accessToken, "learning-management-system");
      if (!verified) {
         return res.status(401).json({ msg: "Token verification failed, authorization denied" });

      }

      next();
   } catch (error) {
      res.status(500).json({ err: error.message });

   }
}
module.exports = auth;
