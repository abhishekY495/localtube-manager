import { NEW_TAB_URLS } from "./constants";

export const isNewTab = (url?: string) => !url || NEW_TAB_URLS.includes(url);
