import { NextRequest, NextResponse } from 'next/server';
import { uploadImageBuffer } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Thiếu file' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await uploadImageBuffer(buffer, { folder: 'blog' });
    return NextResponse.json({ url: result.url, publicId: result.public_id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Upload thất bại' }, { status: 500 });
  }
}


