// qr-generator.js

function generateQRCode(text, isEncrypted = false) {
  const qrOutput = document.getElementById("qrOutput");
  qrOutput.innerHTML = ""; // Clear any previous QR

  // Encode URL to open ar-view.html with data as param
  const encodedText = encodeURIComponent(text);
  // const qrUrl = `ar-view.html?data=${encodedText}&enc=${isEncrypted}`;
const qrUrl = `${window.location.origin}/ar-view.html?data=${encodedText}&enc=${isEncrypted}`;



  const qrCode = new QRCode(qrOutput, {
    text: qrUrl,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}
