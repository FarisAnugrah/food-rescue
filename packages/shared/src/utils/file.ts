export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export function validateImageFile(file: File | null): string | null {
  if (!file || file.size === 0) return null;

  if (!file.type.startsWith("image/")) {
    return "File harus berupa gambar (JPG, PNG, WEBP).";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Ukuran foto terlalu besar. Maksimal 2MB.";
  }

  return null;
}