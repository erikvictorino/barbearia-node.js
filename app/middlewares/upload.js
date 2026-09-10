import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "public/imeg")
    },
    filename: function (req, file, cb){
        cb(null, file.originalname + path.extname(file.originalname))
    }
})
const upload = multer({storage})

export default upload