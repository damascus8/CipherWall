// qr-generator.js

// Get DOM elements
const generateQRBtn = document.getElementById("generateQRBtn");
const qrOutput = document.getElementById("qrOutput");
const qrLinkSection = document.getElementById("qrLinkSection");
const qrLink = document.getElementById("qrLink");

generateQRBtn.addEventListener("click", async () => {
  const result = document.getElementById("result").value.trim();
  const encryptionType = document.getElementById("encryptionType").value;
  const key = document.getElementById("key").value.trim();

  if (!result) return alert("⚠️ No result to encode into QR");

  const isEncrypted = document.getElementById("action").value === "encrypt";

  const payload = {
    encrypted: isEncrypted,
    type: encryptionType,
    payload: result,
  };

  // ✅ Only send key for AES or Caesar if present
  if (isEncrypted && ["aes", "caesar"].includes(encryptionType) && key) {
    payload.key = key;
  }

  try {
    const res = await fetch("https://cipherwall-backend.onrender.com/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.id) throw new Error("Failed to save message");

    const url = `${window.location.origin}/message-view.html?id=${data.id}`;
    showQRCode(url);
    qrLink.textContent = url;
    qrLink.href = url;
    qrLinkSection.classList.remove("hidden");
  } catch (err) {
    console.error("❌ Save failed:", err.message);
    alert("❌ Could not generate QR. Try again.");
  }
});

function showQRCode(url) {
  qrOutput.innerHTML = "";
  new QRCode(qrOutput, {
    text: url,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}