(function () {
  const CLIP_TEXT = "Clip coupon";
  const STORAGE_KEY = "publix_coupon_auto_refresh";

  let running = false;

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function getClipButtons() {
    return [...document.querySelectorAll("button")]
      .filter(btn =>
        btn.innerText.trim().includes(CLIP_TEXT) &&
        !btn.dataset.autoClipped
      );
  }

  async function clipCoupons() {
    const buttons = getClipButtons();

    console.log(`FOUND ${buttons.length} COUPONS`);

    for (const btn of buttons) {
      btn.dataset.autoClipped = "true";

      btn.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      await sleep(200);

      btn.click();

      console.log("CLIPPED");

      await sleep(350);
    }

    return buttons.length;
  }

  async function runClipper() {
    if (running) return;

    running = true;

    localStorage.setItem(STORAGE_KEY, "true");

    const clipped = await clipCoupons();

    if (clipped === 0) {
      console.log("NO MORE COUPONS FOUND");

      localStorage.removeItem(STORAGE_KEY);

      alert("Finished clipping all available coupons.");

      return;
    }

    console.log(`REFRESHING AFTER ${clipped} COUPONS`);

    await sleep(2000);

    location.reload();
  }

  function createUI() {
    if (document.getElementById("publix-auto-clip-btn")) {
      return;
    }

    const button = document.createElement("button");

    button.id = "publix-auto-clip-btn";

    button.innerText = "Clip All Coupons";

    Object.assign(button.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "999999",
      padding: "14px 18px",
      background: "#0a6c2f",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
    });

    button.addEventListener("click", runClipper);

    document.body.appendChild(button);
  }

  async function autoResume() {
    const shouldResume = localStorage.getItem(STORAGE_KEY);

    if (!shouldResume) {
      return;
    }

    console.log("AUTO-RESUMING");

    await sleep(4000);

    runClipper();
  }

  createUI();

  autoResume();
})();