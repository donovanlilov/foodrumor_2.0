 const db = require("../models");
 const jwt = require("jsonwebtoken");

 exports.signin = async function(req, res, next) {
try{
    let user = await db.User.findOne({
        email: req.body.email
 });
 let { id, username, profileImageUrl } = user
 let isMatch = await user.comparePassword(req.body.password)
 if(isMatch){
    // commented
    let token = jwt.sign({
        //id:
         id,
        username,
        profileImageUrl
    },
    process.env.SECRET_KEY
    );
    return res.status(200).json({
        id,
        username,
        profileImageUrl,
    token
    });
 } else {
   return next({
    status: 400,
    message: "Invalid Email/Password"
   }); 

 }
} catch (e) {
    return next({ status: 400, message: "Invalid Email/Password"});
}
 };

 exports.signup = function( req, res, next) {
    try {
        console.log("in backend and reached sign in end point")
        let user = db.User.create(req.body);
        let {id, username, profileImageUrl }  = user
        let token = jwt.sign(
            {
            id,
            username,
            profileImageUrl
        }, 
        process.env.SECRET_KEY
        );
        return res.status(200).json({
           id, 
           username,
           profileImageUrl,
           token 
        });

    } catch(err){
if(err.code === 11000){
    err.message = "Sorry, that username and/or email is taken already"
}
return next({
    status: 400,
    message: err.message

});

    }
 };