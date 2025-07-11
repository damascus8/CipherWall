// 🔁 Change Start: Initialize encrypted flag and text
let encrypted = false;
let encryptedText = "";
// 🔁 Change End

document.addEventListener("DOMContentLoaded", async () => {
  console.info("📦 DOM loaded: Decryption phase started");

  const params = new URLSearchParams(window.location.search);
  const messageId = params.get("id");
  const enc = params.get("enc") === "true";
  const type = params.get("type") || "aes";
  const rawData = params.get("data");
  
  const status = document.getElementById("status");
  const keyPrompt = document.getElementById("keyPrompt");

  // 🔁 Change Start: Supported local-only decryption types
  const localTypes = ["base64", "rot13", "morse"];

  
  // 🔁 Change End

  console.log("params"+params.toString());
  console.log("rawData"+rawData);
  console.log("XX "+localTypes.includes(type));
  if (!messageId && !rawData) {
    status.textContent = "❌ Invalid or missing message reference.";
    return;
  }

  // 🔁 Change Start: Handle server-side decryption
  if (enc && messageId && !localTypes.includes(type)) {
    status.textContent = `🔐 Encrypted message detected (${type.toUpperCase()})`;
    keyPrompt.classList.remove("hidden");
    window.currentMessageId = messageId;
    window.currentEncType = type;
  }

  /*
  if (enc && messageId) {
  try {
    const res = await fetch(`https://cipherwall-backend.onrender.com/api/message/${messageId}`);
    const data = await res.json();
    if (!res.ok || !data.payload) throw new Error("Message not found");

    if (["aes", "caesar"].includes(type)) {
      // 🔐 Show key prompt for AES/Caesar
      status.textContent = `🔐 Encrypted message detected (${type.toUpperCase()})`;
      keyPrompt.classList.remove("hidden");
      window.currentMessageId = messageId;
      window.currentEncType = type;
    } else {
      // 🔓 Decrypt locally
      const decrypted = decryptLocal(data.payload, type);
      revealText(decrypted);
      status.textContent = `✅ Decrypted locally using ${type.toUpperCase()}`;
    }

  } catch (err) {
    console.error("❌ Failed to load/decrypt message:", err);
    status.textContent = "❌ Error fetching or decrypting the message.";
  }
}

*/








  // 🔁 Change End

  // 🔁 Change Start: Handle local decryption

  

  else if (enc && rawData && localTypes.includes(type)) {
    console.log("ss"+localTypes.includes(type))
     encryptedText = decodeURIComponent(rawData);
    console.log("sid"+encryptedText)
    try {
      const decrypted = decryptLocal(encryptedText, type);
      console.log("decrypted"+decrypted)
      revealText(decrypted);
      status.textContent = `✅ Message decrypted using ${type.toUpperCase()} (Local)`;
    } catch (err) {
      console.error("❌ Local decryption error:", err.message);
      status.textContent = "❌ Failed to decrypt message.";
    }
  }
  // 🔁 Change End

  // 🔁 Change Start: Plaintext fallback
  else {
    const plain = decodeURIComponent(rawData || "");
    console.log("plain"+plain)
    if (!plain) {
      status.textContent = "❌ Failed to read plain message.";
    } else {
      status.textContent = "✅ Plain message loaded";
      revealText(plain);
    }
  }
  // 🔁 Change End
});

async function decryptMessage() {
  console.log("decryptMessage function")
  const key = document.getElementById("keyInput").value.trim();
  const id = window.currentMessageId;
  const type = window.currentEncType;

  if (!id || !key) {
    alert("⚠️ Both ID and key are required.");
    return;
  }

  try {
    const res = await fetch("https://cipherwall-backend.onrender.com/api/decrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, key })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Unknown error");

    document.getElementById("keyPrompt").classList.add("hidden");
    document.getElementById("status").textContent = "✅ Message decrypted";
    revealText(data.decrypted);
  } catch (err) {
    console.error("❌ Decryption failed:", err.message);
    alert("❌ Decryption failed: " + err.message);
    document.getElementById("status").textContent = "❌ Decryption failed.";
  }
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
  }, 30);
}

// 🔁 Change Start: Add local decryption handler
function decryptLocal(text, type) {
  console.log("decrypting local")
  switch (type) {
    case "base64":
      return atob(text);
    case "rot13":
      return text.replace(/[A-Za-z]/g, (c) => {
        const base = c <= "Z" ? 65 : 97;
        return String.fromCharCode((c.charCodeAt(0) - base + 13) % 26 + base);
      });
    case "morse":
      return decryptMorse(text); // Must exist in encryption.js
    default:
      throw new Error("Unsupported encryption type for local decryption.");
  }
}
// 🔁 Change End
