export function mimeTypeToExtension(mimeType: string): string {
  const mimeTypes: { [key: string]: string } = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "application/pdf": "pdf",
    "text/plain": "txt",
    // Ajoutez d'autres types MIME et leurs extensions si nécessaire
  };

  return mimeTypes[mimeType] || "";
}
