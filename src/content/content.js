import "./content.css";

const observer = new MutationObserver((mutations, observer) => {
  const likeBtn = document.querySelector(".YtLikeButtonViewModelHost");
  if (likeBtn) {
    console.log("like btn found");
    observer.disconnect(); // Stop observing once the element is found

    likeBtn.addEventListener("click", () => {
      console.log("like btn clicked");
    });
  } else {
    console.log("like btn not found");
  }
});

// Start observing the DOM for changes
observer.observe(document.body, { childList: true, subtree: true });
