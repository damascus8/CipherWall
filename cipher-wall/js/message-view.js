let encryptionType = "aes";
let messageId = null;
let isEncrypted = false;

// DOM Ready
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  messageId = params.get("id");

  const display = document.getElementById("messageDisplay");
  const status = document.getElementById("status");
  const keyPrompt = document.getElementById("keyPrompt");

  if (!messageId) {
    status.textContent = "❌ Invalid or missing message ID.";
    return;
  }

  try {
    const res = await fetch(`https://cipherwall-backend.onrender.com/api/fetch/${messageId}`);
    const data = await res.json();

    if (!data || !data.payload) {
      status.textContent = "❌ Message not found or expired.";
      return;
    }

    encryptionType = data.type || "aes";
    isEncrypted = data.encrypted;

    if (isEncrypted) {
      status.textContent = `🔐 Encrypted using ${encryptionType.toUpperCase()} with key.`;
      document.getElementById("keyPrompt").classList.remove("hidden");
    } else {
      status.textContent = "✅ Plain message loaded";
      revealText(data.payload);
    }
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    status.textContent = "❌ Failed to fetch message.";
  }
});

// Decrypt with key (Phase 4 with hashing)
async function decryptMessage() {
  const key = document.getElementById("keyInput").value.trim();
  if (!key) return alert("⚠️ Please enter the decryption key.");

  try {
    const res = await fetch("https://cipherwall-backend.onrender.com/api/decrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: messageId,
        key
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Invalid key.");
    }

    document.getElementById("status").textContent = "✅ Message decrypted";
    document.getElementById("keyPrompt").classList.add("hidden");
    revealText(data.message);
  } catch (err) {
    console.error("❌ Decryption error:", err.message);
    alert("❌ Incorrect key or expired message.");
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
  }, 50);
}
