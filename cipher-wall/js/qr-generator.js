// qr-generator.js
/*
function generateQRCode(text, isEncrypted = false, type = "aes") {
  const qrOutput = document.getElementById("qrOutput");
  qrOutput.innerHTML = ""; // Clear previous QR

  const encodedText = encodeURIComponent(text);
  const qrUrl = `${window.location.origin}/message-view.html?data=${encodedText}&enc=${isEncrypted}&type=${type}`;

  console.info("🔐 Encrypted message (used in QR):", encodedText);
  console.info("QR URL:", qrUrl);

  new QRCode(qrOutput, {
    text: qrUrl,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}

**/

function generateQRCode(text, isEncrypted = false) {
  const qrOutput = document.getElementById("qrOutput");
  qrOutput.innerHTML = "";

  const type = document.getElementById("encryptionType").value; // ✅ capture type
  const encodedText = encodeURIComponent(text);

  const qrUrl = `${window.location.origin}/message-view.html?data=${encodedText}&enc=${isEncrypted}&type=${type}`;

  console.info("🔐 QR URL:", qrUrl);

  new QRCode(qrOutput, {
    text: qrUrl,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}
