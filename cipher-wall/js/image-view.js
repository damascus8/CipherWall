// 📄 js/views/image-view.js

document.addEventListener("DOMContentLoaded", () => {
  const decryptBtn = document.getElementById("decryptBtn");
  const secretKeyInput = document.getElementById("secretKey");
  const decryptedImage = document.getElementById("decryptedImage");
  const imageSection = document.getElementById("image-section");
  const loader = document.getElementById("loader");
  const errorBox = document.getElementById("error");

  const urlParams = new URLSearchParams(window.location.search);
  const imageId = urlParams.get("id");

  if (!imageId) {
    errorBox.textContent = "Invalid or missing image ID in URL.";
    errorBox.classList.remove("hidden");
    return;
  }

  decryptBtn.addEventListener("click", async () => {
    const key = secretKeyInput.value.trim();
    if (!key) {
      showError("Secret key is required.");
      return;
    }

    try {
      loader.classList.remove("hidden");
      errorBox.classList.add("hidden");

      const res = await fetch(`/api/view-image?id=${imageId}&key=${encodeURIComponent(key)}`);
      if (!res.ok) {
        throw new Error("Decryption failed. Invalid key or image not found.");
      }

      const data = await res.json();
      if (!data || !data.imageData) {
        throw new Error("No image data received.");
      }

      decryptedImage.src = `data:image/png;base64,${data.imageData}`;
      imageSection.classList.remove("hidden");
    } catch (err) {
      showError(err.message);
    } finally {
      loader.classList.add("hidden");
    }
  });

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove("hidden");
    imageSection.classList.add("hidden");
  }
});