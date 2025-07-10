let encrypted = false;
let encryptedText = "";

let encryptionType = "aes"; // default

document.addEventListener("DOMContentLoaded", () => {
  console.info("📦 DOM Loaded");

let encryptionType = "aes";
let messageId = "";


  const params = new URLSearchParams(window.location.search);

  const data = decodeURIComponent(params.get("data") || "");
  const isEnc = params.get("enc") === "true";
  encryptionType = params.get("type") || "aes";

  messageId = params.get("id");

  const display = document.getElementById("messageDisplay");
  const status = document.getElementById("status");
  const keyPrompt = document.getElementById("keyPrompt");

  if (!data) {
    status.textContent = "❌ Invalid or missing data.";
    return;
  }

  if (isEnc) {
    encrypted = true;
    encryptedText = data;
    keyPrompt.classList.remove("hidden");
    status.textContent = `🔐 Encrypted message detected (${encryptionType.toUpperCase()})`;
  } else {
    status.textContent = "✅ Plain message loaded";
    revealText(data);
  }
});

// async function decryptMessage() {
//   const key = document.getElementById("keyInput").value.trim();

//   if (["aes", "caesar"].includes(encryptionType) && !key) {
//     return alert("⚠️ Key is required to decrypt.");
//   }

//   try {
//     const res = await fetch("https://cipherwall-backend.onrender.com/api/decrypt", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         payload: encryptedText,
//         key,
//         type: encryptionType
//       })
//     });


    revealText(decrypted);
    
    document.getElementById("keyPrompt").classList.add("hidden");
    document.getElementById("status").textContent = "✅ Message decrypted";
  } catch (err) {
    console.error("❌ Decryption error:", err.message);
    alert("❌ Incorrect key or corrupted data.");
  }



async function decryptMessage() {
  const key = document.getElementById("keyInput").value.trim();
  const id = new URLSearchParams(window.location.search).get("id");
  const res = await fetch("https://cipherwall-backend.onrender.com/api/decrypt", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ id, key })
  });
  if (!res.ok) throw await res.json();
  const { decrypted } = await res.json();
  revealText(decrypted);

}

function revealText(text) {
  const display = document.getElementById("messageDisplay");
  display.classList.remove("hidden");
  display.textContent = "";

  let index = 0;
  const interval = setInterval(() => {
    if (index <= text.length) {
      display.textContent = text.slice(0, index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 50);
}
