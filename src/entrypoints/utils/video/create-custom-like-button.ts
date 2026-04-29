import {
  CUSTOM_LIKE_BUTTON_ICON_ID,
  CUSTOM_LIKE_BUTTON_ID,
  likeIcon,
  likeIconFilled,
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
    <span id="${CUSTOM_LIKE_BUTTON_ICON_ID}">${isLiked ? likeIconFilled : likeIcon}</span>
    <p>${likeCount}</p>
  `;

  return customLikeButton;
};
