let encrypted = false;
let encryptedText = "";
let encryptionType = "aes";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const messageId = params.get("id");

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
      status.textContent = "❌ Message not found or corrupted.";
      return;
    }

    encryptionType = data.type || "aes";

    if (data.encrypted) {
      encrypted = true;
      encryptedText = data.payload;
      keyPrompt.classList.remove("hidden");
      status.textContent = `🔐 Encrypted using ${encryptionType.toUpperCase()} with key.`;
    } else {
      status.textContent = "✅ Plain message loaded";
      revealText(data.payload);
    }
  } catch (err) {
    console.error("❌ Error fetching message:", err.message);
    status.textContent = "❌ Failed to fetch message from backend.";
  }
});

function decryptMessage() {
  const key = document.getElementById("keyInput").value.trim();

  if (["aes", "caesar"].includes(encryptionType) && !key) {
    return alert("⚠️ Key is required to decrypt.");
  }

  try {
    const decrypted = encryptDecrypt({
      message: encryptedText,
      key,
      type: encryptionType,
      action: "decrypt"
    });

    if (!decrypted || decrypted.startsWith("❌")) {
      throw new Error("Decryption failed");
    }

    revealText(decrypted);
    document.getElementById("keyPrompt").classList.add("hidden");
    document.getElementById("status").textContent = "✅ Message decrypted";
  } catch (err) {
    console.error("❌ Decryption error:", err.message);
    alert("❌ Incorrect key or corrupted data.");
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
