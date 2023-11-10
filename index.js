const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const download = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const Booking = require("./models/Booking");
require("dotenv").config();
const PlaceRelatedRoutes = require("./routes/PlaceRel");
const UserRelatedRoutes = require("./routes/UserRel");
const PhotoRelatedRoutes = require("./routes/PhotosRel");

const BASE_URL = process.env.BASE_URL;

const PORT = process.env.PORT || 4100;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: `${BASE_URL}`,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//     optionsSuccessStatus: 200,
//   })
// );

// Enable CORS for a specific origin (e.g., your Netlify app)'

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://stayhub-143.netlify.app"
    );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

app.use(cookieParser());

// const secretSalt = bcrypt.genSaltSync(10);

const jwtSecrectKey = process.env.JWT_SECRET_KEY;

// connecting database

const dbConnect = async (url) => {
  try {
    db = await mongoose.connect(url);
    console.log("Database Successfully Connected");
  } catch (e) {
    console.log(e.message);
  }
};

dbConnect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  console.log("Hello ! I am under water");
  res.json("test Ok");
});

app.use("/user", UserRelatedRoutes);

app.use("/places", PlaceRelatedRoutes);

// uploads image
app.use("/uploads", express.static(__dirname + "/uploads"));

app.post("/upload-by-link", async (req, res) => {
  try {
    const { link } = req.body;

    const newName = "photo" + Date.now() + ".jpg";
    await download.image({
      url: link,
      // __dirname: 'C:\\Users\\Shree\\Documents\\Web development course\\Final Projects Full Stack\\Airbnb\\Api'
      dest: __dirname + "/uploads/" + newName,
    });

    res.json(newName);
  } catch (e) {
    res.status(422).json({ "Error while uploading image ": e.message });
  }
});

// middleware for photo
const photosMiddleware = multer({ dest: "uploads/" });

app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  // console.log(req.files)

  try{
    const uploadedFiles = [];

    for (let i = 0; i < req.files.length; i++) {
        const fileInfo = req.files[i];
        const { path, originalname } = fileInfo;

        const parts = originalname.split(".");
        const extension = parts[parts.length - 1];

        const newPath = path + "." + extension;
        fs.renameSync(path, newPath);

        uploadedFiles.push(newPath.replace("uploads\\", ""));
    }

    res.json(uploadedFiles);

  }catch(e) {
    throw e;
  }
});

/// booking

app.post("/bookplace", async (req, res) => {
  try {
    const { token } = req.cookies;

    if (token) {
      jwt.verify(token, jwtSecrectKey, {}, async (err, tokendata) => {
        if (!tokendata || err) {
          throw err;
        }

        const {
          place,
          checkIn,
          checkOut,
          nameOfUser,
          numGuests,
          phone,
          price,
        } = req.body;

        const doc = await Booking.create({
          place,
          user: tokendata.id,
          checkIn,
          checkOut,
          nameOfUser,
          numGuests,
          phone,
          price,
        });

        // console.log(doc.place);
        res.json(doc);
      });
    } else {
      console.log("Token is not available");
      res.status(401).json("Login or register");
    }
  } catch (e) {
    throw e;
  }
});

// to grab all the booking of any user

app.get("/bookings", (req, res) => {
  try {
    const { token } = req.cookies;

    if (token) {
      jwt.verify(token, jwtSecrectKey, {}, async (err, tokendata) => {
        if (err) throw err;

        res.json(await Booking.find({ user: tokendata.id }).populate("place"));
      });
    } else {
      console.log("Token is not available");
    }
  } catch (e) {
    throw e;
  }
});

// const UserRelatedRoutes = require('./routes/UserRel');



// app.use('/photo' , PhotoRelatedRoutes);

// app.use()

// app.listen(4100);
app.listen(PORT);
