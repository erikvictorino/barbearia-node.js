import multer from 'multer'
import cloudinary from '../../config/cloudinary.js'

const storage = multer.memoryStorage({})
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
})
export default upload

export function uploadToCloudinary(buffer, folder = 'uploads') {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error) return reject(error)
            resolve(result)
        }).end(buffer)
    })
}