export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`; // Bytes
  } else if (bytes < 1024 ** 2) {
    return `${(bytes / 1024).toFixed(1)} KB`; // Kilobytes
  } else if (bytes < 1024 ** 3) {
    return `${(bytes / 1024 ** 2).toFixed(1)} MB`; // Megabytes
  } else {
    return `${(bytes / 1024 ** 3).toFixed(1)} GB`; // Gigabytes
  }
}
