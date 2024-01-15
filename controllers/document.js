const DocumentModel = require("../models/document");
const fs = require("fs");
const { json } = require("body-parser");
const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: 'dgejssmll', 
    api_key: '235636159233983', 
    api_secret: 'eXjWXEfK79rDnd47QXcZ9TvZymc' 
});


async function uploadToCloudinary(locaFilePath) {
    // locaFilePath :
    // path of image which was just uploaded to "uploads" folder
  
    var mainFolderName = "uploads"
    // filePathOnCloudinary :
    // path of image we want when it is uploded to cloudinary
    var filePathOnCloudinary = mainFolderName + "/" + locaFilePath
    
    return cloudinary.uploader.upload(filePathOnCloudinary, {"public_id": locaFilePath, "resource_type": "auto"})
    .then((result) => {
      // Image has been successfully uploaded on cloudinary
      // So we dont need local image file anymore
      // Remove file from local uploads folder 
    //   fs.unlinkSync(filePathOnCloudinary);
      //console.log(result);
      return {
        message: "Success",
        url:result.url,
        public_id: result.public_id,
      };
    }).catch((error) => {
        //console.log(error);
      // Remove file from local uploads folder 
    //   fs.unlinkSync(filePathOnCloudinary)
      return {message: "Fail",};
    });
}


exports.uploadDocument = async (req, res, next) => {
    const {documentTitle} = req.body;
    const documentFilePath = req.file.filename;
    console.log(documentFilePath);
    var result = await uploadToCloudinary(documentFilePath);
    let today = new Date();
    let newDocument = new DocumentModel({
        docName: documentTitle,
        docUrl: result.url,
        docGeneratedOn: today.toISOString(),
        publicId: result.public_id
    })

    newDocument.save().then(saved => {
        return res.status(200).json({
            status: true,
            message: `${documentTitle} Uploaded Successfully!`,
            fileUrl: result.url,
            document: saved
        })
    }).catch(err => {
        console.log(err);
        return res.status(400).json({
            status: false,
            message: `${documentTitle} Uploade Failed, Please Try Again!`,
        })
    })
}

exports.deleteDocument = async (req, res, next) => {
    const { documentId, publicId } = req.body;

    cloudinary.uploader.destroy(publicId,  { invalidate: true, resource_type: "raw" }, (result) => {
        //console.log(result);
    });

    await DocumentModel.findByIdAndDelete(documentId).then(deleted => {
        return res.status(200).json({
            status: true,
            message: `${publicId} Deleted Successfully!`
        })
    })
    .catch(err => {
        console.log(err);
        return res.status(400).json({
            status: false,
            message: `${publicId} Delete Failed, Please Try Again!`
        })
    })
}

exports.getAllDocuments = async (req, res, next) => {
    let { type } = req.query; // all, signed, unsigned

    let query = {};

    if (type === 'all') {
        query = {}
    } else if (type === 'signed') {
        query = { signature: { $exists: true, $ne: null } }
    } else {
        query = { signature: { $exists: false } }
    }

    let results = await DocumentModel.find(query).sort({ documentGeneratedOn: -1 }).exec();
    return res.status(200).json({
        status: true,
        total: results.length,
        data: results
    })
}

exports.getDocument = async (req, res, next) => {
    let { docId } = req.query;

    let data = await DocumentModel.findById(docId).exec();

    return res.status(200).json({
        status: true,
        data: data
    })
}