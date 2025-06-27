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
  document.getElementById("qrOutput").innerHTML="";
  document.getElementById("noteHistory").innerHTML="";
  alert("🧽 Screen cleared!");
}

function handleInputRules() {
  const type = document.getElementById("encryptionType").value;
  const messageInput = document.getElementById("message");
  const keyInput = document.getElementById("key");

  // Restrict message input for ROT13, Caesar, Morse
  if (["rot13", "caesar"].includes(type)) {
    messageInput.setAttribute("pattern", "[A-Za-z ]+");
    messageInput.setAttribute("title", "Only alphabets and spaces allowed.");
  } else {
    messageInput.removeAttribute("pattern");
    messageInput.removeAttribute("title");
  }

  // Key handling
if (type === "morse") {
  messageInput.addEventListener("input", restrictToMorseOnly);
} else {
  messageInput.removeEventListener("input", restrictToMorseOnly);
}

  if (type === "rot13" || type === "morse" || type === "base64") {
  keyInput.disabled = false;
  keyInput.value = "";
  keyInput.placeholder = "Optional password";
  keyInput.removeAttribute("pattern");
  keyInput.title = "Optional password to protect or unlock the message.";
} else {
  keyInput.disabled = false;

  if (type === "caesar") {
    keyInput.placeholder = "Enter numeric key (e.g. 3)";
    keyInput.setAttribute("pattern", "[0-9]+");
    keyInput.title = "Only numbers are allowed for Caesar Cipher.";
  } else if (type === "aes") {
    keyInput.placeholder = "Enter secret key";
    keyInput.removeAttribute("pattern");
    keyInput.title = "Use a strong alphanumeric key (e.g. MyS3cretKey123)";
  }
}



}

function restrictToTextOnly(event) {
  const clean = event.target.value.replace(/[^A-Za-z ]/g, '');
  if (event.target.value !== clean) {
    event.target.value = clean;
  }
}

function restrictToMorseOnly(event) {
  // Allow only A-Z, a-z, 0–9 and space
  const clean = event.target.value.replace(/[^A-Za-z0-9 ]/g, '');
  if (event.target.value !== clean) {
    event.target.value = clean;
  }
}
