
//image validation

const isValidImage = (image) => {
    if (/(\/*\.(?:png|jpeg))/.test(image))
        return true
}


module.exports = {isValidImage}
