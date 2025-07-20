
document.addEventListener("DOMContentLoaded", () => {

  const text = "CIPHER WALL";
  const typingTarget = document.getElementById("typing-text");
  let index = 0;

  const type = () => {
    if (index < text.length) {
      // Add glitch character briefly
      const glitchChar = String.fromCharCode(33 + Math.floor(Math.random() * 94));
      typingTarget.textContent = text.slice(0, index) + glitchChar;

      setTimeout(() => {
        typingTarget.textContent = text.slice(0, index + 1);
        index++;
        setTimeout(type, 100); // typing speed
      }, 60);
    } else {
      // Wait 2.5 seconds then fade out
      setTimeout(() => {
        const intro = document.getElementById("intro-screen");
        intro.style.transition = "opacity 1s ease";
        intro.style.opacity = 0;
        setTimeout(() => intro.remove(), 1000); // fully remove after fade
      }, 2500);
    }
  };

  type();


////

  handleInputRules();
  console.info("JEST 1");
  document.querySelector("button[onclick='process()']").onclick = process;
  document.querySelector("button[onclick='clearScreen()']").onclick = clearScreen;
  document.querySelector("button.download-btn").onclick = downloadResult;

document.getElementById("generateQRBtn").onclick = () => {
  console.info("generateQRBtn called via btn 2");
  const result = document.getElementById("result").value;
  const action = document.getElementById("action").value;
  const type = document.getElementById("encryptionType").value;

  if (!result.trim()) {
    alert("⚠️ No message to convert into QR.");
    return;
  }

  const isEncrypted = action === "encrypt" && ["aes", "caesar", "rot13", "morse", "base64"].includes(type);
  generateQRCode(result, isEncrypted, type); // 🔁 Updated
};


});


window.copyToClipboard = function () {
  if (!window.latestQRLink) return alert("❌ No link to copy!");

  navigator.clipboard.writeText(window.latestQRLink)
    .then(() => alert("✅ Link copied to clipboard!"))
    .catch(err => {
      console.error("Clipboard copy failed:", err);
      alert("❌ Failed to copy the link.");
    });
}


