import express from 'express'
import ResumeController from './resume.controller.js'
import multer from "multer"

const router = express.Router()

// setup multer
const pdfStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploadedFiles/')
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(pdf)$/)) {
            var err = new Error()
            err.code = 'filetype'
            return cb(err)
        } else {
            cb(null, Date.now() + '_' + file.originalname)
        }
                
        // cb(null, file.originalname)
    }
})

//create multer instance
const pdfUpload = multer({ storage: pdfStorage })

// router.route('/id/:id').get(ResumeController.apiGetResume)
// router.route('/upload').get(ResumeController.uploadPage)
router.route('/upload').post(pdfUpload.single('filetoupload'), ResumeController.upload)

export default router
