// downloader.js

function downloadResult() {
  const message = document.getElementById("message").value;
  const key = document.getElementById("key").value;
  const action = document.getElementById("action").value;
  const type = document.getElementById("encryptionType").value;
  const result = document.getElementById("result").value;

  if (!message || !result) {
    alert("⚠️ Please encrypt or decrypt something first.");
    return;
  }

  const cleanText = `
Cipher Wall - Saved Entry 🛡️

Original Message:
${message}

Action: ${action.toUpperCase()}
Encryption Type: ${type.toUpperCase()}
Key Used: ${key || "(No key used)"}

Final Output:
${result}

🔒 Powered by Cipher Wall | Created by Siddharth Shrivastav
`;

  const blob = new Blob([cleanText.trim()], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `cipher_entry.txt`;
  a.click();

  URL.revokeObjectURL(url);
}
