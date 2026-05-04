export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} b`; // bytes
  } else if (bytes < 1024 ** 2) {
    return `${(bytes / 1024).toFixed(1)} kb`; // kilobytes
  } else if (bytes < 1024 ** 3) {
    return `${(bytes / 1024 ** 2).toFixed(1)} mb`; // megabytes
  } else {
    return `${(bytes / 1024 ** 3).toFixed(1)} gb`; // gigabytes
  }
};
