import "./popup.css";

console.log("hello from popup.js");

const removeLikedVideosBtn = document.querySelector("#remove-liked-videos-btn");
if (removeLikedVideosBtn) {
  removeLikedVideosBtn.addEventListener("click", async () => {
    console.log(123123);
  });
}
