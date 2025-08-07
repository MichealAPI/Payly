import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export const uploadImage = async (
  file: Express.Multer.File,
  folderName: string,
  identifier: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        public_id: identifier,
        overwrite: true,
        invalidate: true,
        folder: `payly/${folderName}`,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) {
          return reject(
            new Error(`Failed to upload image: ${error.message}`),
          );
        }
        if (result) {
          resolve(result.public_id);
        } else {
            reject(new Error('Failed to upload image: result is undefined'));
        }
      },
    );

    const readableStream = new Readable();
    readableStream.push(file.buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};
