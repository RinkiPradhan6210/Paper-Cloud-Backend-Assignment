const imageModel = require("../models/imageModel")
const {isValidFile, isValidObjectId} = require("../validators/validator")
const { uploadFile } = require("../aws/aws")

const createImage = async function(req,res){
    try {

        let files = req.files

        let data = {}

        // validation for Product image
        if (files.length == 0) return res.status(400).send({ status: false, message: "Please Provide Image" })
        if (!isValidFile(files[0].originalname)) return res.status(400).send({ status: false, message: 'Image type should be png or jpeg format' })
        data.image = await uploadFile(files[0])
        data.uploadedDate = new Date()


        let imagedata = await imageModel.create(data)
        res.status(201).send({ status: true, message: "Success", data: imagedata })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
 

const getImage = async function(req, res){
    try{
        //let imageId = req.params.imageId
        let uploadedDate = req.body
        
       // if(!imageId)return res.status(400).send({status:false, message:"please provide image id"})

        //if (!isValidObjectId(imageId)) return res.status(400).send({ status: false, message: "productId is invalid" })

        let existId = await imageModel.find().sort({uploadedDate:1}).limit(3)
        if(!existId)return res.status(404).send({status:false, message:"image is not found in db"})
        return res.status(200).send({status:true, data:existId})


    }catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
 



module.exports = {createImage, getImage}