const User = require('../models/User')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secretSalt = bcrypt.genSaltSync(10);

const jwtSecrectKey = process.env.JWT_SECRET_KEY;

exports.getUserProfile = (req , res) => {

    try{
        const {token} = req.cookies;
    // console.log(token)

    if(token) {      
        jwt.verify(token , jwtSecrectKey , {} , async (err , tokenData) => {
            if(err) throw err;
            
            // we are getting user details after login and they are persisting as cookie is storing them
            const {name , email , _id} = await User.findById(tokenData.id)

            res.json({name , email , _id});
        });

    }else{
        res.json(null); 
    }
    }catch(e) {
        throw e;
    }
    
    // res.json(token)
}


exports.registerUser = async (req , res) => {
    
    try{ 
        const {name , email , password} = req.body;

        const newUser = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password , secretSalt)
        })

        // console.log(newUser)

        res.json(newUser); 

    }catch(e){
        console.log("Error happened " , e);
        res.status(422).json(e);
    }
    
}



exports.loginUser = async (req , res) => {
    
    try{ 
        const { email , password } = req.body;

        const userPresent = await User.findOne({email});
         
        if(userPresent) {
            // console.log("User finded");
            const passOk = bcrypt.compareSync(password , userPresent.password);
            if(passOk){

                jwt.sign({email : userPresent.email , 
                    id : userPresent._id
                } , jwtSecrectKey , { expiresIn: '1h' } , (err , token) => {

                    if (err) {
                      console.error(err);
                      return res
                        .status(500)
                        .json({ error: "Internal Server Error" });
                    }

                    const userLoggedIn = {
                        name : userPresent.name,
                        email : userPresent.email,
                        _id : userPresent._id
                    }
                   
                    // res.cookie('token' , token).json(userLoggedIn);
                    
                    res.cookie("token", token, {
                      domain: "stayhub-backend3.onrender.com",
                      path: "/",
                      httpOnly: true,
                      sameSite: 'None', 
                      secure: true 
                    //   sameSite: "None",
                    });

                    if(token){
                        console.log(token);
                    }else{
                        console.log('No Token');
                    }
                     res.json(userLoggedIn);

                    //  console.log(userLoggedIn)
                })
          
                // res.json("User Logined")
            }else{
                res.status(422).json("wrong password entered")
            }  
        }else{
            console.log("User Not found");
            res.status(401).json("User Not found ")
        }
         
    }catch(e){
        console.log("Error happened " , e);
        res.status(422).json(e);
    }
}


exports.logoutUser = (req , res) => {

    // just reset the cookie

    try{

    //   res.clearCookie('token', {
    //     domain: "stayhub-backend3.onrender.com",
    //     path: '/',
    //   });


      res.cookie('token', ' ');
        
      
        const { token } = req.cookies;
        // console.log(token);
      // Redirect the user to the login or home page
      res.redirect("/places"); // Replace with the appropriate route

      res.json(true);

    //   res.json(true);
    }catch(e) {
        throw e;
    }

}


