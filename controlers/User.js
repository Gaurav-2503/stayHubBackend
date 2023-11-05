const User = require('../models/User')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const secretSalt = bcrypt.genSaltSync(10);

const jwtSecrectKey = process.env.JWT_SECRET_KEY;

exports.getUserProfile = (req , res) => {

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

        console.log(newUser)

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
            console.log("User finded");
            const passOk = bcrypt.compareSync(password , userPresent.password);
            if(passOk){

                jwt.sign({email : userPresent.email , 
                    id : userPresent._id
                } , jwtSecrectKey , {} , (err , token) => {
                    if(err){ 
                        throw err;
                    } 
                    const userLoggedIn = {
                        name : userPresent.name,
                        email : userPresent.email,
                        _id : userPresent._id
                    }
                    res.cookie('token' , token).json(userLoggedIn);
                    console.log(userLoggedIn)
                })
          
                // res.json("User Logined")
            }else{
                res.status(422).json("wrong password entered")
            }  
        }else{
            console.log("User Not found");
            res.status(422).json("User Not found ")
        }
         
    }catch(e){
        console.log("Error happened " , e);
        res.status(422).json(e);
    }
}


exports.logoutUser = (req , res) => {

    // just reset the cookie
    res.cookie('token' , '').json(true);

}


