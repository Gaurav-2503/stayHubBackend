const Place = require("../models/Place");
const jwt = require("jsonwebtoken");

const jwtSecrectKey = process.env.JWT_SECRET_KEY;

exports.getAllPlaces = async (req , res) => {

    res.json(await Place.find());

}


exports.getUserPlaces = async (req , res) => {
    const {token} = req.cookies;

    jwt.verify(token , jwtSecrectKey , {} , async (err , tokenData) => {

        const {id} = tokenData;

        res.json(await Place.find({owner : id}))

    });

};


exports.createPlace = async (req , res) => {

    const {token} = req.cookies;

    const {title , address , addedPhotos ,
        description , perks , extraInfo ,
        checkIn , checkOut , maxGuests , price
    } = req.body;
 
    jwt.verify(token , jwtSecrectKey , {} , async (err , tokenData) => {
        if(err) throw err;
  
        const placeAdded = await Place.create({

            owner : tokenData.id,
            title , 
            address , 
            photos:addedPhotos ,
            description , 
            perks , 
            extraInfo ,
            checkIn , 
            checkOut , 
            maxGuests ,
            price 
        })  
         
        res.json(placeAdded);
    });
 
}

exports.getPlaceById = async (req , res) => {

    const {id} = req.params;

    res.json(await Place.findById(id));

}

exports.updatePlace = async (req , res) => {

    const {token} = req.cookies;

    const {id , title , address , addedPhotos ,
        description , perks , extraInfo ,
        checkIn , checkOut , maxGuests , 
        price 
    } = req.body;  
  
  
    jwt.verify(token , jwtSecrectKey , {} , async (err , tokenData) => {

        if(err) throw err;

        const placeAdded = await Place.findById(id); 

        // placeAdded.owner gives object id and tokenData.id is string , comparision can't happen .
        // Therefore converting object id to string

        if(tokenData.id === placeAdded.owner.toString() ){
            // we can update          

            placeAdded.set({

                title , 
                address , 
                photos:addedPhotos ,
                description , 
                perks , 
                extraInfo ,
                checkIn , 
                checkOut , 
                maxGuests ,
                price
            })
            await  placeAdded.save()
            res.json('ok');
        }
    }); 
    
}