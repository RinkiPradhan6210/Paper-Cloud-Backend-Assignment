const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController')

router.post('/images', imageController.createImage);

router.get('/images', imageController.getImage)

module.exports=router;