// Shrinks a photo to a small JPEG before upload (keeps storage tiny and loading fast).
export async function toCover(file: File, max = 720): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new Error('Choose an image file.')
  const bmp = await createImageBitmap(file)
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height))
  const c = document.createElement('canvas')
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k)
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
  return new Promise((res, rej) => c.toBlob(b => (b ? res(b) : rej(new Error('Could not process that image.'))), 'image/jpeg', 0.82))
}
