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

// Map conformity code to the corresponding step index
export const codeToStep = (code: string): number => {
  if (!code) return 0; // Default to generic error if no code is provided

  // Success case - code 1.0 should go to success screen (step 4)
  if (code === "1.0") {
    return 4; // Conform - success
  }

  // Document not valid (codes 7.x) - check this before codes 2.x
  if (code.startsWith("7")) {
    // Document not valid
    return 3;
  }

  // Document not readable/processing issues (codes 2.x)
  if (code.startsWith("2")) {
    // Document not readable
    return 1;
  }

  // Document does not correspond to user input (codes 3.x, 4.x, 5.x, 8.x)
  if (
    code.startsWith("3") ||
    code.startsWith("4") ||
    code.startsWith("5") ||
    code.startsWith("8")
  ) {
    // Document does not correspond to user input
    return 2;
  }

  return 0; // Default to generic error
};
