let isEncrypted = false;
let encryptedText = "";
let keyPromptVisible = false;

document.addEventListener("DOMContentLoaded", () => {
  // Simulate fetching QR data (replace with actual QR scanner later)
  const urlParams = new URLSearchParams(window.location.search);
  const data = decodeURIComponent(urlParams.get("data") || "");
  const isEnc = urlParams.get("enc") === "true";
  const textEl = document.getElementById("textDisplay");

  if (!data) {
    textEl.setAttribute("text", "value: ❌ Invalid QR data");
    return;
  }

  if (isEnc) {
    isEncrypted = true;
    encryptedText = data;
    document.getElementById("decryptPrompt").style.display = "block";
    textEl.setAttribute("text", "value: 🔐 Encrypted Message...\nPlease enter key.");
  } else {
    animateText(data);
  }
});

function submitDecryptionKey() {
  const key = document.getElementById("decryptKey").value.trim();
  if (!key) return alert("Key is required!");

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) throw "Invalid decryption";

    animateDecryption(encryptedText, decrypted);
    document.getElementById("decryptPrompt").style.display = "none";
  } catch (e) {
    alert("❌ Invalid Key or Corrupt Data.");
  }
}

function animateText(text) {
  const textEl = document.getElementById("textDisplay");
  textEl.setAttribute("text", "value: ");
  let index = 0;

  const interval = setInterval(() => {
    if (index <= text.length) {
      textEl.setAttribute("text", "value: " + text.slice(0, index));
      index++;
    } else {
      clearInterval(interval);
    }
  }, 80);
}

function animateDecryption(from, to) {
  const textEl = document.getElementById("textDisplay");
  textEl.setAttribute("text", "value: ");
  let i = 0;

  const interval = setInterval(() => {
    let partial = "";
    for (let j = 0; j < to.length; j++) {
      partial += j < i ? to[j] : from[j] || ".";
    }
    textEl.setAttribute("text", "value: " + partial);
    i++;
    if (i > to.length) clearInterval(interval);
  }, 100);
}
