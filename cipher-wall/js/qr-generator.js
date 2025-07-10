async function generateQRCode(text, isEncrypted = false) {
  const qrOutput = document.getElementById("qrOutput");
  qrOutput.innerHTML = "";

  const type = document.getElementById("encryptionType").value;
  // Save message to backend and link using returned ID
  fetch("https://<your-backend>/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ encrypted: isEncrypted, type, payload: text, key: isEncrypted ? document.getElementById("key").value : undefined })
  })
    .then(r => r.json())
    .then(data => {
      const link = `${window.location.origin}/message-view.html?id=${data.id}`;
      new QRCode(qrOutput, {
        text: link,
        width: 200,
        height: 200,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel: QRCode.CorrectLevel.H
      });
      document.getElementById("qrLinkSection").classList.remove("hidden");
      document.getElementById("qrLink").href = link;
      document.getElementById("qrLink").textContent = link;
    })
    .catch(err => alert("❌ Save failed: " + err.message));
}