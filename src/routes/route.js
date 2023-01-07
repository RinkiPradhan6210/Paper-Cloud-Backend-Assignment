const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController')

router.post('/images', imageController.createImage);

router.get('/images', imageController.getImage)

//API for checking wrong route-Of-API
router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        message: "The api as per your request is not available"
    })
})


module.exports=router;