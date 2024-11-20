import { Video, YoutubeChannel } from "../types";
import { getVideoUrlSlug } from "./getVideoUrlSlug";

export function getChannelObj(ownerElement: HTMLElement) {
  console.log(ownerElement);
  const channel: YoutubeChannel = {
    name: "FireShip",
    handle: "@Fireship2121",
    id: new Date().toString(),
    imageUrl: "www.google.com",
    addedAt: new Date().toISOString(),
  };

  return channel;
}
