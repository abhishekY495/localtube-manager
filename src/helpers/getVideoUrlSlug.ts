export function getVideoUrlSlug() {
  const url = window.location.href;
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/
  );
  return match ? match[1] : null;
}
