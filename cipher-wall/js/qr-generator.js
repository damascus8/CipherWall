async function generateQRCode(text, isEncrypted = false) {
  const qrOutput = document.getElementById("qrOutput");
  qrOutput.innerHTML = "";

  const type = document.getElementById("encryptionType").value;

  // 🟢 STEP 1: Save message to backend
  const payload = {
    encrypted: isEncrypted,
    message: text,
    type: type
  };

  let messageId = "";
  try {
    const res = await fetch("https://cipherwall-backend.onrender.com/api/saveMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    messageId = data.messageId;
    if (!messageId) throw new Error("No messageId received.");
  } catch (err) {
    alert("❌ Failed to save message to server.");
    console.error(err);
    return;
  }

  // 🟢 STEP 2: Generate QR with only ID and encryption type
  const qrUrl = `${window.location.origin}/message-view.html?id=${messageId}&enc=${isEncrypted}&type=${type}`;

  new QRCode(qrOutput, {
    text: qrUrl,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  // Show shareable link
  const qrLink = document.getElementById("qrLink");
  const qrLinkSection = document.getElementById("qrLinkSection");
  qrLink.href = qrUrl;
  qrLink.textContent = qrUrl;
  qrLinkSection.classList.remove("hidden");

  // For copy function
  window.latestQRLink = qrUrl;
}
