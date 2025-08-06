import {v2 as cloudinary} from 'cloudinary';
import streamifier from 'streamifier';

async function uploadImage(fileBuffer, folderName, identifier) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: 'image',
            public_id: identifier,
            overwrite: true,
            invalidate: true,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            folder: "payly/" + folderName,
            transformation: [
                { quality: 'auto', fetch_format: 'auto' }
            ]
        }, (error, result) => {
            if (error) {
                return reject(new Error(`Failed to upload image: ${error.message}`));
            }
            resolve(result.public_id);
        });

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
}

export { uploadImage };