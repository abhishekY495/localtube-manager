const dashboardBtn = document.querySelector(
  "#dashboard-btn"
) as HTMLAnchorElement;
dashboardBtn.addEventListener("click", () => {
  browser.tabs.update({
    url: browser.runtime.getURL("/dashboard.html"),
  });
});
