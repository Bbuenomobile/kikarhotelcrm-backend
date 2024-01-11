const router = require('express').Router();
const DocumentController = require("../../controllers/document");
const multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        ////console.log('file-', file)
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({ storage: storage });

router.post("/uploadDocument" , upload.single('document'), DocumentController.uploadDocument);
router.get("/deleteDocument", DocumentController.deleteDocument);

module.exports = {
    router: router,
    basePath: '/'
};