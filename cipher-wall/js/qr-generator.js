function generateQRCode(text, isEncrypted = false) {
  console.info("generateQRCode called via btn 1");


  const qrOutput = document.getElementById("qrOutput");
  const qrLink = document.getElementById("qrLink");
  const qrLinkSection = document.getElementById("qrLinkSection");


//


const loader = document.getElementById("qrLoader");

// 🧠 Before generation
loader.classList.remove("hidden");
qrOutput.innerHTML = "";



//






  qrOutput.innerHTML = "";
  qrLink.textContent = "";
  qrLink.href = "#";
  qrLinkSection.classList.add("hidden");

  const type = document.getElementById("encryptionType").value;
  const key = document.getElementById("key").value.trim();

  if (!text.trim()) {
    alert("⚠️ Cannot generate QR from empty message.");
    return;
  }

  const payload = {
    encrypted: isEncrypted,
    type,
    payload: text
  };

  if (isEncrypted && ["aes", "caesar"].includes(type) && key) {
    payload.key = key;
  }

  fetch("https://cipherwall-backend.onrender.com/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json().then(data => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
      if (!ok || !data.id) throw new Error("QR generation failed");
      const finalURL = `${window.location.origin}/message-view.html?id=${data.id}&type=${type}&enc=${isEncrypted}`;
      
    setTimeout(() => {  
      // console.info("IN");
      showQRCode(finalURL);
      // ✅ Hide loader after generation
  loader.classList.add("hidden");
}, 200); // Use slight timeout to simulate load
    
    })
    .catch(err => {
      console.error("❌ Save failed:", err.message);
      alert("❌ Could not generate QR. Try again.");
    });
}

function showQRCode(url) {
  const qrOutput = document.getElementById("qrOutput");
  const qrLink = document.getElementById("qrLink");
  const qrLinkSection = document.getElementById("qrLinkSection");

  qrOutput.innerHTML = "";

  new QRCode(qrOutput, {
    text: url,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  qrLink.textContent = url;
  qrLink.href = url;
  qrLinkSection.classList.remove("hidden");

  window.latestQRLink = url;
}
