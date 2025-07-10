// function generateQRCode(text, isEncrypted = false) {
//   const qrOutput = document.getElementById("qrOutput");
//   qrOutput.innerHTML = "";

//   const type = document.getElementById("encryptionType").value;
//   const encodedText = encodeURIComponent(text);
//   const qrUrl = `${window.location.origin}/message-view.html?data=${encodedText}&enc=${isEncrypted}&type=${type}`;

//   console.info("🔐 QR URL:", qrUrl);

//   const qr = new QRCode(qrOutput, {
//   text: qrUrl,
//   width: 200,
//   height: 200,
//   colorDark: "#000000",     // black dots
//   colorLight: "#ffffff",    // white background ✅
//   correctLevel: QRCode.CorrectLevel.H
  
// });


// }

function generateQRCode(text, isEncrypted = false) {
  const qrOutput = document.getElementById("qrOutput");
  qrOutput.innerHTML = "";

  const type = document.getElementById("encryptionType").value;
  const encodedText = encodeURIComponent(text);
  const qrUrl = `${window.location.origin}/message-view.html?data=${encodedText}&enc=${isEncrypted}&type=${type}`;

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
