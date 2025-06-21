// uiHandlers.js


function process() {
  const message = document.getElementById("message").value;
  const key = document.getElementById("key").value;
  const action = document.getElementById("action").value;
  const type = document.getElementById("encryptionType").value;

  const result = encryptDecrypt({ message, key, type, action });
  document.getElementById("result").value = result;

  const summary = `➤ ${action === "encrypt" ? "Encrypted" : "Decrypted"} using ${type.toUpperCase()} ${type === "aes" || type === "caesar" ? "🔐" : "🔧"} ${type === "aes" ? "with key." : ""}`;
  addAutoNote(summary);

}

function clearScreen() {
  if (!confirm("⚠️ Do you really want to clear the screen?")) return;

  document.getElementById("message").value = "";
  document.getElementById("key").value = "";
  document.getElementById("result").value = "";
  document.getElementById("action").value = "encrypt";

  alert("🧽 Screen cleared!");
}
