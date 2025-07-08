let encrypted = false;
let encryptedText = "";
let encryptionType = "aes"; // default

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const isEnc = params.get("enc") === "true";
  encryptionType = params.get("type") || "aes";

  const display = document.getElementById("messageDisplay");
  const status = document.getElementById("status");
  const keyPrompt = document.getElementById("keyPrompt");

  if (!id) {
    status.textContent = "❌ Invalid or missing message ID.";
    return;
  }

  // 🟢 Fetch message by ID from backend
  try {
    const res = await fetch(`https://cipherwall-backend.onrender.com/api/message/${id}`);
    const data = await res.json();
    const message = data.message;

    if (!message) throw new Error("Empty message received");

    if (isEnc) {
      encrypted = true;
      encryptedText = message;
      keyPrompt.classList.remove("hidden");
      status.textContent = `🔐 Encrypted message detected (${encryptionType.toUpperCase()})`;
    } else {
      status.textContent = "✅ Plain message loaded";
      revealText(message);
    }
  } catch (err) {
    console.error("❌ Error fetching message:", err);
    status.textContent = "❌ Failed to load message.";
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
