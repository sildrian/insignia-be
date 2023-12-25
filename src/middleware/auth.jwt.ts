// const jwt = require("jsonwebtoken");
// import {Jwt} from 'jsonwebtoken'
// const config = require("../config/auth.config.js");
// const db = require("../app/models");
// const User = db.user;

// verifyToken = (req, res, next) => {
//   let allToken = req.headers.authorization
//   if(allToken == null){
//     return res.status(403).send({
//       message: "No token provided!"
//     });
//   }
//   let rawToken =  allToken.split(" ")
//   if(rawToken != null && rawToken[0] == "Bearer"){
//     let token = rawToken[1];

//     jwt.verify(token,
//       config.secret,
//       (err, decoded) => {
//         if (err) {
//           return res.status(401).send({
//             message: "Unauthorized!",
//           });
//         }
//         req.userId = decoded.id;
//         next();
//       });
//   }else{
//     return res.status(400).send({
//       message: "token not JWT"
//     });
//   }
// };

// const authJwt = {
//   verifyToken: verifyToken
// };
// module.exports = authJwt;