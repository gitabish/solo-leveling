import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sfxDir = path.join(process.cwd(), 'src', 'audio', 'sfx');
    if (!fs.existsSync(sfxDir)) {
      return NextResponse.json({ exists: false });
    }

    const files = fs.readdirSync(sfxDir);
    const popupFile = files.find((f) => /^popup\.(mp3|wav|ogg|m4a)$/i.test(f));

    if (popupFile) {
      return NextResponse.json({
        exists: true,
        filename: popupFile,
        url: `/audio/sfx/${encodeURIComponent(popupFile)}`,
      });
    }

    return NextResponse.json({ exists: false });
  } catch (err) {
    console.error('Error checking sfx file:', err);
    return NextResponse.json({ exists: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name).toLowerCase() || '.mp3';
    const targetFilename = `popup${ext}`;

    const srcDir = path.join(process.cwd(), 'src', 'audio', 'sfx');
    const pubDir = path.join(process.cwd(), 'public', 'audio', 'sfx');

    if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });
    if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

    // Save as popup.<ext>
    fs.writeFileSync(path.join(srcDir, targetFilename), buffer);
    fs.writeFileSync(path.join(pubDir, targetFilename), buffer);

    // Also mirror to popup.mp3 if different extension for universal fallback
    if (targetFilename !== 'popup.mp3') {
      fs.writeFileSync(path.join(srcDir, 'popup.mp3'), buffer);
      fs.writeFileSync(path.join(pubDir, 'popup.mp3'), buffer);
    }

    return NextResponse.json({
      success: true,
      filename: targetFilename,
      url: `/audio/sfx/${encodeURIComponent(targetFilename)}`,
    });
  } catch (err) {
    console.error('Failed to upload sfx file:', err);
    return NextResponse.json({ error: 'Failed to save audio file' }, { status: 500 });
  }
}
