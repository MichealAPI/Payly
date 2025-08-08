import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export const uploadImage = async (
  configService: ConfigService,
  file: Express.Multer.File,
  folderName: string,
  identifier: string,
): Promise<{ publicId: string; version: number }> => {
  // 1) resolve credentials synchronously
  cloudinary.config({
    cloud_name:  configService.get<string>('CLOUDINARY_CLOUD_NAME'),
    api_key:     configService.get<string>('CLOUDINARY_API_KEY'),
    api_secret:  configService.get<string>('CLOUDINARY_API_SECRET'),
    secure:      true,
  });
  
  // 2) now call upload_stream with plain values
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        public_id:     identifier,
        overwrite:     true,
        invalidate:    true,
        folder:        `payly/${folderName}`,
        transformation:[{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading image:', error);
          return reject(new Error(`Failed to upload image: ${error.message}`));
        }
        if (!result) {
          return reject(new Error('Failed to upload image: result is undefined'));
        }
        resolve({ publicId: result.public_id, version: result.version as number });
      },
    );

    const readableStream = new Readable();
    readableStream.push(file.buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};
