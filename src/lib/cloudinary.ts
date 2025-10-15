import { v2 as cloudinary } from 'cloudinary';

// Cloudinary will auto-configure from CLOUDINARY_URL env
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export async function uploadImageBuffer(buffer: Buffer, opts?: { folder?: string }) {
  return await new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: opts?.folder || 'uploads',
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
}


