import confetti from "canvas-confetti";

// Create a confetti instance that doesn't use Web Workers
const confettiInstance = confetti.create(undefined, {
  resize: true,
  useWorker: false,
});

const dashboardBtn = document.querySelector(
  "#dashboard-btn"
) as HTMLAnchorElement;
dashboardBtn.addEventListener("click", () => {
  browser.tabs.update({
    url: browser.runtime.getURL("/dashboard.html"),
  });
});

const count = 200;
const defaults = {
  origin: { y: 0.7 },
};

function fire(particleRatio: number, opts: any) {
  confettiInstance({
    ...defaults,
    ...opts,
    particleCount: Math.floor(count * particleRatio),
  });
}

// Fire different confetti effects
fire(0.25, { spread: 26, startVelocity: 55 });
fire(0.2, { spread: 60 });
fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
fire(0.1, { spread: 120, startVelocity: 45 });
