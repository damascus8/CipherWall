let encrypted = false;
let encryptedText = "";
// let encryptionType = "aes"; // default fallback
document.addEventListener("DOMContentLoaded", async () => {
  console.info("📦 DOM loaded: Decryption phase started");

  const params = new URLSearchParams(window.location.search);
  const messageId = params.get("id");
  const enc = params.get("enc") === "true";
  const type = params.get("type") || "aes";

  const status = document.getElementById("status");
  const keyPrompt = document.getElementById("keyPrompt");
  const display = document.getElementById("messageDisplay");

  if (!messageId) {
    status.textContent = "❌ Invalid or missing message reference.";
    return;
  }

  try {
    const res = await fetch(`https://cipherwall-backend.onrender.com/api/message/${messageId}`);
    const { payload, type: fetchedType, encrypted } = await res.json();

    window.currentEncType = fetchedType || type;
    window.currentPayload = payload;
    window.currentMessageId = messageId;

    if (!payload) {
      status.textContent = "❌ No payload found.";
      return;
    }

    if (!encrypted) {
      // ✅ Plain message, directly display
      status.textContent = "✅ Plain message loaded";
      revealText(payload);
      return;
    }

    if (["aes", "caesar"].includes(fetchedType)) {
      // 🔐 Server-decrypted types
      status.textContent = `🔐 Encrypted message detected (${fetchedType.toUpperCase()})`;
      keyPrompt.classList.remove("hidden");
    } else {
      // 🧠 Local-decrypted types
      status.textContent = `🔐 Encrypted (${fetchedType}) - decrypting locally...`;
      const decrypted = decryptLocally(fetchedType, payload);
      revealText(decrypted);
    }
  } catch (err) {
    console.error("❌ Failed to load message:", err.message);
    status.textContent = "❌ Failed to load or decrypt message.";
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

    if (!res.ok) throw new Error(data.error || "Unknown error");

    document.getElementById("keyPrompt").classList.add("hidden");
    document.getElementById("status").textContent = "✅ Message decrypted";
    revealText(data.decrypted);
  } catch (err) {
    console.error("❌ Decryption failed:", err.message);
    alert("❌ Decryption failed: " + err.message);
  }
}

function decryptLocally(type, payload) {
  try {
    switch (type) {
      case "rot13":
        return payload.replace(/[A-Za-z]/g, c =>
          String.fromCharCode(
            (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13)
              ? c
              : c - 26
          )
        );
      case "base64":
        return atob(payload);
      case "morse":
        return morseToText(payload);
      default:
        return "❌ Unsupported encryption type.";
    }
  } catch (err) {
    console.error("❌ Local decryption error:", err);
    return "❌ Failed to decrypt locally.";
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

// Add your existing Morse logic here
function morseToText(morseCode) {
  const morseMap = {
    ".-": "A", "-...": "B", "-.-.": "C", "-..": "D",
    ".": "E", "..-.": "F", "--.": "G", "....": "H",
    "..": "I", ".---": "J", "-.-": "K", ".-..": "L",
    "--": "M", "-.": "N", "---": "O", ".--.": "P",
    "--.-": "Q", ".-.": "R", "...": "S", "-": "T",
    "..-": "U", "...-": "V", ".--": "W", "-..-": "X",
    "-.--": "Y", "--..": "Z", "-----": "0", ".----": "1",
    "..---": "2", "...--": "3", "....-": "4", ".....": "5",
    "-....": "6", "--...": "7", "---..": "8", "----.": "9"
  };

  return morseCode.split(" ").map(code => morseMap[code] || " ").join("");
}