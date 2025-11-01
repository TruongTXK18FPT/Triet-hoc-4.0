import { v2 as cloudinary } from 'cloudinary';

// Cloudinary will auto-configure from CLOUDINARY_URL env
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export async function uploadImageBuffer(
  buffer: Buffer, 
  opts?: { 
    folder?: string;
    transformation?: {
      width?: number;
      height?: number;
      crop?: string;
      gravity?: string;
    };
  }
) {
  return await new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    const uploadOptions: any = {
      folder: opts?.folder || 'uploads',
      resource_type: 'image',
    };

    // Add transformation if provided
    if (opts?.transformation) {
      uploadOptions.width = opts.transformation.width;
      uploadOptions.height = opts.transformation.height;
      uploadOptions.crop = opts.transformation.crop;
      uploadOptions.gravity = opts.transformation.gravity;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(new Error(error.message || 'Upload failed'));
        if (!result) return reject(new Error('Upload failed: No result returned'));
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
}


