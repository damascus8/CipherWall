async function generateQRCode(text, isEncrypted = false) {
  const qrOutput = document.getElementById("qrOutput");
  qrOutput.innerHTML = "";

  const type = document.getElementById("encryptionType").value;

  // Step 1: Save encrypted/plaintext message to backend
  const res = await fetch("https://cipherwall-backend.onrender.com/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      encrypted: isEncrypted,
      type: type,
      payload: text
    })
  });

  const data = await res.json();

  if (!data.id) {
    console.error("❌ No messageId received.");
    return alert("❌ Failed to save message to backend.");
  }

  // Step 2: Create QR code with ID-based URL
  const qrUrl = `${window.location.origin}/message-view.html?id=${data.id}`;

  new QRCode(qrOutput, {
    text: qrUrl,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  // Step 3: Show shareable link
  const qrLink = document.getElementById("qrLink");
  const qrLinkSection = document.getElementById("qrLinkSection");
  qrLink.href = qrUrl;
  qrLink.textContent = qrUrl;
  qrLinkSection.classList.remove("hidden");

  window.latestQRLink = qrUrl;
}
