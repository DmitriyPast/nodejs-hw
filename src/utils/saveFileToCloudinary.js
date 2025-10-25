import { Readable } from 'node:stream';
import { v2 as cloudinary } from 'cloudinary';

export async function saveFileToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'notehub-app/avatars',
        resource_type: 'image',
        overwrite: true,
        unique_filename: true,
        use_filename: false,
      },
      (err, res) => (err ? reject(err) : resolve(res)),
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}
