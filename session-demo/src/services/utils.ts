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

export // Map conformity code to the corresponding step index
const codeToStep = (code: string): number => {
  if (!code) return 0; // Default to generic error if no code is provided
  if (code === "1.0") {
    return 4; // Conform
  }
  if (code.includes("2")) {
    // Document not readable
    return 1;
  }
  if (
    code.includes("3") ||
    code.includes("4") ||
    code.includes("5") ||
    code.includes("8")
  ) {
    // Document does not correspond to user input
    return 2;
  }
  if (code.includes("7")) {
    // Document not valid
    return 3;
  }
  return 0; // Default to generic error
};
