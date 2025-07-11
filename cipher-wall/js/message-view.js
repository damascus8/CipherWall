let encrypted = false;
let encryptedText = "";
let encryptionType = "aes"; // default fallback

document.addEventListener("DOMContentLoaded", async () => {
  console.info("📦 DOM loaded: Decryption phase started");

  const params = new URLSearchParams(window.location.search);
  const messageId = params.get("id");
  const enc = params.get("enc") === "true";
  const type = params.get("type") || "aes";
  const rawData = params.get("data");

  const status = document.getElementById("status");
  const keyPrompt = document.getElementById("keyPrompt");

  // 🆕 Local decryption types
  const localTypes = ["base64", "rot13", "morse"];

  if (!messageId && !rawData) {
    status.textContent = "❌ Invalid or missing message reference.";
    return;
  }

  // 🌐 Server decryption (AES or Caesar)
  if (enc && messageId && !localTypes.includes(type)) {
    status.textContent = `🔐 Encrypted message detected (${type.toUpperCase()})`;
    keyPrompt.classList.remove("hidden");

    // 🧠 Store for decrypt button
    window.currentMessageId = messageId;
    window.currentEncType = type;
  // 🧠 Local decryption via data param
  } else if (enc && rawData && localTypes.includes(type)) {
    const encryptedText = decodeURIComponent(rawData);

    try {
      const decrypted = decryptLocal(encryptedText, type); // 🔓 See function below
      revealText(decrypted);
      status.textContent = `✅ Message decrypted using ${type.toUpperCase()} (Local)`;
    } catch (err) {
      console.error("❌ Local decryption error:", err.message);
      status.textContent = "❌ Failed to decrypt message.";
    }

  // 🔓 Plain message
  } else {
    const plain = decodeURIComponent(rawData || "");
    if (!plain) {
      status.textContent = "❌ Failed to read plain message.";
    } else {
      status.textContent = "✅ Plain message loaded";
      revealText(plain);
    }
  }
});

async function decryptMessage() {
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

    if (!res.ok) {
      throw new Error(data.error || "Unknown error");
    }

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

// 🆕 Local decryption for base64, rot13, morse
function decryptLocal(text, type) {
  switch (type) {
    case "base64":
      return atob(text);
    case "rot13":
      return text.replace(/[A-Za-z]/g, (c) => {
        const base = c <= "Z" ? 65 : 97;
        return String.fromCharCode((c.charCodeAt(0) - base + 13) % 26 + base);
      });
    case "morse":
      return decryptMorse(text); // 💡 This must be defined in encryption.js
    default:
      throw new Error("Unsupported encryption type for local decryption.");
  }
}