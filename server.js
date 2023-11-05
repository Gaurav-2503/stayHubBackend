const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

console.log("HEllo")

const url = 'mongodb://127.0.0.1:27017/crud-express'

mongoose.connect(url, {useNewUrlParser: true }).then(() => {  
            console.log("Databse Connected Successfully!!"); }
    ).catch(err => { 
        console.log('Could not connect to the database', err); process.exit(); 
    }); 


app.listen(4000);

