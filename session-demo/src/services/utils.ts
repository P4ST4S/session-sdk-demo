export function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "application/octet-stream";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  // Créer un File avec les propriétés nécessaires
  const file = new File([u8arr], filename, { type: mime });

  // Ajouter les propriétés que Multer attend (hack nécessaire)
  (file as any).originalname = filename;
  (file as any).mimetype = mime;

  return file;
}

export function getMimeTypeFromDataURL(dataurl: string): string | null {
  const match = dataurl.match(/^data:(.*?);/);
  return match ? match[1] : null;
}
