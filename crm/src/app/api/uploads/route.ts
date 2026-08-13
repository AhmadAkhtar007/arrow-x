import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MiB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File exceeds 5MB size limit.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid file type. Only PNG, JPEG, and WebP are allowed.' }, { status: 400 });
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const randomHex = crypto.randomBytes(8).toString('hex');
    const safeFileName = `proof_${Date.now()}_${randomHex}.${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'proofs');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const destinationPath = path.join(uploadsDir, safeFileName);

    // Verify containment within uploadsDir
    const resolvedPath = path.resolve(destinationPath);
    if (!resolvedPath.startsWith(path.resolve(uploadsDir))) {
      return NextResponse.json({ error: 'Invalid file path destination.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destinationPath, buffer);

    const publicUrl = `/uploads/proofs/${safeFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: safeFileName,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process file upload.' }, { status: 500 });
  }
}
