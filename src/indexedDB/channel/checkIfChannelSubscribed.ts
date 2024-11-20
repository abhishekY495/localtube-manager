import { initializeYoutubeDB } from "../initializeYoutubeDB";

let observer: MutationObserver | null = null;

export async function checkIfChannelSubscribed() {
  const db = await initializeYoutubeDB();
  const isSubscribed = await db.get("subscribedChannels", "123aqwe");
  console.log(isSubscribed ? "Subscribed" : "Not subscribed");

  if (observer) {
    observer.disconnect();
    observer = null;
  }

  setTimeout(() => {
    observer = new MutationObserver(() => {
      const aboveTheFoldElement = document.querySelector(
        "#above-the-fold"
      ) as HTMLElement;
      if (aboveTheFoldElement === null) {
        console.log("aboveTheFoldElement not found");
        return;
      }
      // console.log(aboveTheFoldElement)

      const ownerElement = aboveTheFoldElement.querySelector(
        "#owner"
      ) as HTMLElement;
      if (ownerElement === null) {
        console.log("ownerElement not found");
        return;
      }
      // console.log(ownerElement)

      // clearing previous custom subscribe button
      const myCustomSubscribeButton = document.querySelector(
        ".custom-nologin-yt-subscribe-btn"
      ) as HTMLElement;
      if (myCustomSubscribeButton) {
        myCustomSubscribeButton.remove();
        console.log("myCustomSubscribeButton found, removing it");
      } else {
        console.log("myCustomSubscribeButton not found");
      }

      // creating custom subscribe button
      const customSubscribeButton = document.createElement(
        "div"
      ) as HTMLElement;
      customSubscribeButton.classList.add("custom-nologin-yt-subscribe-btn");
      customSubscribeButton.innerText = isSubscribed
        ? "Subscribed"
        : "Subscribe";
      ownerElement.appendChild(customSubscribeButton);

      customSubscribeButton.addEventListener("click", async () => {
        console.log(123123);

        // const youtubeChannel = getChannelObj(ownerElement);
        // console.log(youtubeChannel);

        // const db = await initializeYoutubeDB();
        // const tx = db.transaction("subscribedChannels", "readwrite");
        // const subscribedChannelsStore = tx.objectStore("subscribedChannels");

        // await subscribedChannelsStore.add(youtubeChannel);
        // await tx.done;
        // db.close();

        // const channels = await getSubscribedChannels();
        // console.log("all channels", channels);
      });

      observer?.disconnect();
      console.log("observer disconnected");
    });
    console.log("searching");
    observer.observe(document.body, { childList: true, subtree: true });
  }, 1800);
}
