import {
  CUSTOM_LIKE_BUTTON_ICON_ID,
  CUSTOM_LIKE_BUTTON_ID,
  LIKE_ICON,
  LIKE_ICON_FILLED,
} from "@/entrypoints/utils/constants";

export const createCustomLikeButton = ({
  likeCount,
  isLiked,
}: {
  likeCount: string;
  isLiked: boolean;
}) => {
  const customLikeButton = document.createElement("div");
  customLikeButton.id = CUSTOM_LIKE_BUTTON_ID;
  customLikeButton.innerHTML = `
    <span id="${CUSTOM_LIKE_BUTTON_ICON_ID}">${isLiked ? LIKE_ICON_FILLED : LIKE_ICON}</span>
    <p>${likeCount}</p>
  `;

  return customLikeButton;
};
