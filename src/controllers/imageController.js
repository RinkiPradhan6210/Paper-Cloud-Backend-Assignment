const imageModel = require("../models/imageModel")
const {isValidImage} = require("../validators/validator")
const { uploadFile } = require("../aws/aws")
const moment = require("moment")

//================================create image document in db and uploaded in AWS S3======================================
const createImage = async function(req,res){
    try {

        let files = req.files
        let bodyData = req.body
        
        //validate uplading data 
        if(Object.keys(bodyData) > 0) return res.status(400).send({status:false,msg:"you can't uploade data expert image"})


        let data = {}

        // validation for  image
        if (files === null || files === undefined || files.length === 0) return res.status(400).send({ status: false, message: "Please Provide Image" })

        if(files.length > 1)return res.status(400).send({status:false,msg:"please uploade one  image at a time"})

        if (!isValidImage(files[0].originalname)) return res.status(400).send({ status: false, message: 'Image type should be png or jpeg format' })
        data.image = await uploadFile(files[0])

        const dateFormat =moment().format('LL')
        
        data.uploadedDate = dateFormat

        // validate size of an image
        if (files[0].size > 1024 * 1024) return res.status(400).send({ status: false, message: 'Image  size should not be greater than 2mb' })
        
        //uploade image
        let uploadedImageData = await imageModel.create(data)
        res.status(201).send({ status: true, message: "Successfully image uploaded", data: uploadedImageData })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
 
//==============================get the documents as per the filter query====================================
const getImage = async function(req, res){
    try{
        
        let filterData= req.query

        let { uploadedDate, uploadedDateGreaterThan, uploadedDateLessThan, sortByUploadedDate, page, limit,  ...rest } = filterData

        //validation for unwanted key
        if(Object.keys(rest).length > 0) return res.status(400).send({status:false, msg:`${Object.keys(rest)} is not a valid filter key for searching data`})

        let searchData = {}

        //find data
       if (uploadedDate) searchData.uploadedDate ={$eq: uploadedDate}  

       if (uploadedDateGreaterThan) searchData.uploadedDate = { $gt: uploadedDateGreaterThan }

       if (uploadedDateLessThan) searchData.uploadedDate = { $lt: uploadedDateLessThan }

       if (uploadedDateGreaterThan && uploadedDateLessThan) searchData.uploadedDate = { $gt: uploadedDateGreaterThan, $lt: uploadedDateLessThan }

        //sorting as per uploaded date
        sortByUploadedDate = parseInt(sortByUploadedDate)
        if(sortByUploadedDate != -1) sortByUploadedDate = 1;

        // paggination
        page = Number(page) || 1
        limit = Number(limit) || 3
        let skip = (page - 1) * limit
        //find total number of matched document
        const count = await imageModel.find(searchData).count()

        const data = await imageModel.find(searchData).sort({uploadedDate:sortByUploadedDate}).skip(skip).limit(limit);
      
      //let totalDocument = data.length 
      if(data.length === 0) return res.status(404).send({status:false, message:"document not available as per your query"});

      return res.status(200).send({status:true,totalDoc:count, data : data});
        
     

    }catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
 



module.exports = {createImage, getImage}


