
document.addEventListener("DOMContentLoaded", () => {
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
