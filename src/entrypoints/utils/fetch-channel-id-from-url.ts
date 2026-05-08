import { CHANNEL_ID_ELEMENTS, CHANNEL_ID_REGEX } from "./constants";

const extractId = (url: string | null) => {
  if (!url) return null;
  const match = url.match(CHANNEL_ID_REGEX);
  return match?.[0] ?? null;
};

export const fetchChannelIdFromUrl = async (
  url: string,
): Promise<string | null> => {
  const response = await fetch(url);
  if (!response.ok) return null;

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const idFromDom = CHANNEL_ID_ELEMENTS.map((element) => {
    if (element.extractId) {
      extractId(
        doc.querySelector(element.selector)?.getAttribute(element.attribute) ??
          null,
      );
    } else {
      return (
        doc.querySelector(element.selector)?.getAttribute(element.attribute) ??
        null
      );
    }
  }).find(Boolean);
  if (idFromDom) return idFromDom;

  const rawMatch = html.match(CHANNEL_ID_REGEX);
  if (rawMatch) return rawMatch[0];

  return null;
};
