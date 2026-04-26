import {
  CUSTOM_LIKE_BUTTON_ID,
  likeIcon,
  likeIconFilled,
} from "@/entrypoints/utils/constants";

export const customLikeBtn = ({
  likeCount,
  isLiked,
}: {
  likeCount: string;
  isLiked: boolean;
}) => {
  const customLikeButton = document.createElement("div");
  customLikeButton.id = CUSTOM_LIKE_BUTTON_ID;
  customLikeButton.innerHTML = `
    ${isLiked ? likeIconFilled : likeIcon}
    <p>${likeCount}</p>
  `;

  return customLikeButton;
};
