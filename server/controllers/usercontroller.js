const Express = require('express');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const router = Express.Router();
const { UserModel } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register
router.post("/register", async (req, res) => {

    let {email, password}  = req.body.user;
try{
  const User = await UserModel.create({
        email,
        password: bcrypt.hashSync(password, 15),
    });
    let token = jwt.sign({id: User.id, email:User.email}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
    res.status(201).json({
        message: "User successfully created",
        user: User,
        sessionToken: token 
    })
} catch(err){
    if(err instanceof UniqueConstraintError){
        res.status(409).json({
            message: "Email already in use",
        });
    } else{
    res.status(500).json({
        message: "Failed to create user",
    });
}
}
});
// Login
router.post("/login", async(req,res) =>{
    let {email, password} = req.body.user;

    try {
        let loginUser = await UserModel.findOne({
            where: {
                email: email,
            },
        });
        if (loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password);

            if (passwordComparison){
                let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET,{expiresIn: 60*60*24});

                res.status(200).json({
                    message: "Login Successful",
                    user: loginUser,
                    sessionToken: token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect email or password"
                })
            }
        } else {
            res.status(401).json({
                message: "Incorrect email or password"
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Login Failed"
        })
    }
});

module.exports = router