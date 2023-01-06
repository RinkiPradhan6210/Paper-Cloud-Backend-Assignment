const mongoose = require("mongoose")
//image validation

const isValidFile = (x) => {
    if (/(\/*\.(?:png|jpeg))/.test(x))
        return true
}


//id validation

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

module.exports = {isValidFile, isValidObjectId}
