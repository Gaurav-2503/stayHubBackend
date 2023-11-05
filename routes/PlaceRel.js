const express = require("express");

const PlaceController = require('../controlers/Places')

const router = express.Router();

router.get('/' , PlaceController.getAllPlaces);

router.get('/userPlaces' , PlaceController.getUserPlaces);

router.post('/' , PlaceController.createPlace);

router.get('/:id' , PlaceController.getPlaceById);

router.put('/' , PlaceController.updatePlace);

module.exports = router;


