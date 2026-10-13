import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rawName = file.name || 'solo-leveling.mp3';
    const ext = path.extname(rawName).toLowerCase() || '.mp3';

    // Save as 01-solo-leveling or formatted filename
    const safeName = rawName.startsWith('01-') ? rawName : `01-${rawName}`;

    const srcDir = path.join(process.cwd(), 'src', 'audio', 'theme');
    const pubDir = path.join(process.cwd(), 'public', 'audio', 'theme');

    if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });
    if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

    // Write to both src/audio/theme and public/audio/theme
    fs.writeFileSync(path.join(srcDir, safeName), buffer);
    fs.writeFileSync(path.join(pubDir, safeName), buffer);

    // Also update standard 01-solo-leveling.mp3 if different name
    if (safeName !== '01-solo-leveling.mp3') {
      fs.writeFileSync(path.join(srcDir, '01-solo-leveling.mp3'), buffer);
      fs.writeFileSync(path.join(pubDir, '01-solo-leveling.mp3'), buffer);
    }

    return NextResponse.json({
      success: true,
      filename: safeName,
      url: `/audio/theme/${encodeURIComponent(safeName)}`,
    });
  } catch (err) {
    console.error('Failed to upload audio file:', err);
    return NextResponse.json({ error: 'Failed to save audio file' }, { status: 500 });
  }
}
