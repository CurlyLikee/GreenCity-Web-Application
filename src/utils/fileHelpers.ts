import fs from 'fs';
import path from 'path';

const TEST_DATA_DIR = path.join(process.cwd(), 'test-data', 'files');

function ensureDir(): void {
  if (!fs.existsSync(TEST_DATA_DIR)) {
    fs.mkdirSync(TEST_DATA_DIR, { recursive: true });
  }
}

/** Minimal valid PNG header + padding to reach target size */
export function createPngFile(fileName: string, sizeBytes: number): string {
  ensureDir();
  const filePath = path.join(TEST_DATA_DIR, fileName);
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
    0x89,
  ]);
  const padding = Buffer.alloc(Math.max(0, sizeBytes - pngHeader.length), 0);
  fs.writeFileSync(filePath, Buffer.concat([pngHeader, padding]));
  return filePath;
}

export function createGifFile(fileName: string, sizeBytes: number): string {
  ensureDir();
  const filePath = path.join(TEST_DATA_DIR, fileName);
  const gifHeader = Buffer.from('GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x00\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;');
  const padding = Buffer.alloc(Math.max(0, sizeBytes - gifHeader.length), 0);
  fs.writeFileSync(filePath, Buffer.concat([gifHeader, padding]));
  return filePath;
}

export function createJpegFile(fileName: string, sizeBytes: number): string {
  ensureDir();
  const filePath = path.join(TEST_DATA_DIR, fileName);
  const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
  const padding = Buffer.alloc(Math.max(0, sizeBytes - jpegHeader.length), 0xff);
  fs.writeFileSync(filePath, Buffer.concat([jpegHeader, padding]));
  return filePath;
}
