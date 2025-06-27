
document.addEventListener("DOMContentLoaded", () => {
  handleInputRules();
  document.querySelector("button[onclick='process()']").onclick = process;
  document.querySelector("button[onclick='clearScreen()']").onclick = clearScreen;
  document.querySelector("button.download-btn").onclick = downloadResult;




document.getElementById("generateQRBtn").onclick = () => {
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
