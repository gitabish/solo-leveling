import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const themeDir = path.join(process.cwd(), 'src', 'audio', 'theme');

    if (!fs.existsSync(themeDir)) {
      return NextResponse.json({ tracks: [] });
    }

    const files = fs.readdirSync(themeDir);
    const audioRegex = /\.(mp3|ogg|wav|m4a)$/i;

    const audioFiles = files.filter((file) => audioRegex.test(file));

    // Natural sort: 01-, 2-, 10- in correct numerical order
    audioFiles.sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    );

    const tracks = audioFiles.map((filename) => ({
      filename,
      url: `/api/theme-music/${encodeURIComponent(filename)}`,
      fallbackUrl: `/audio/theme/${encodeURIComponent(filename)}`,
    }));

    return NextResponse.json({ tracks });
  } catch (err) {
    console.error('Error discovering theme music:', err);
    return NextResponse.json({ tracks: [] });
  }
}
