function process() {
  const message = document.getElementById("message").value;
  const key = document.getElementById("key").value;
  const action = document.getElementById("action").value;
  const type = document.getElementById("encryptionType").value;
  let result = "";


const morseMap = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..", 0: "-----", 1: ".----", 2: "..---",
  3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...",
  8: "---..", 9: "----.", " ": "/"
};

const reverseMorse = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]));

  if (!message || (type === "aes" && !key)) {
    alert("Please enter message" + (type === "aes" ? " and key!" : "!"));
    return;
  }

  if (type === "aes") {
    if (action === "encrypt") {
      result = CryptoJS.AES.encrypt(message, key).toString();
    } else {
      try {
        const bytes = CryptoJS.AES.decrypt(message, key);
        result = bytes.toString(CryptoJS.enc.Utf8);
        if (!result) throw "Failed";
      } catch (e) {
        result = "❌ Decryption failed!";
      }
    }
  }

  else if (type === "base64") {
    if (action === "encrypt") {
      result = btoa(message);
    } else {
      try {
        result = atob(message);
      } catch (e) {
        result = "❌ Invalid Base64 input!";
      }
    }
  }

  else if (type === "rot13") {
    result = message.replace(/[a-zA-Z]/g, function (char) {
      const start = char <= "Z" ? 65 : 97;
      const offset = (char.charCodeAt(0) - start + (action === "encrypt" ? 13 : 13)) % 26;
      return String.fromCharCode(start + offset);
    });
  }

  else if (type === "caesar") {
  const shift = parseInt(key) || 0;
  if (!Number.isInteger(shift)) {
    result = "❌ Caesar needs a numeric key!";
  } else {
    result = message.replace(/[a-zA-Z]/g, function (char) {
      const start = char <= "Z" ? 65 : 97;
      const offset = (char.charCodeAt(0) - start + (action === "encrypt" ? shift : 26 - shift)) % 26;
      return String.fromCharCode(start + offset);
    });
  }
}


else if (type === "morse") {
  if (action === "encrypt") {
    result = message.toUpperCase().split('').map(ch => morseMap[ch] || '').join(' ');
  } 
else {
  try {
    result = message.split(' ').map(m => {
      if (!reverseMorse[m]) throw new Error("Invalid Morse Code input!");
      return reverseMorse[m];
    }).join('');
  } catch (e) {
    result = "❌ Invalid Morse Code input!";
  }
}


}

  document.getElementById("result").value = result;

  // Auto-generated note (no manual input needed)
//   const summary = `[${new Date().toLocaleString()}] ➤ ${action === "encrypt" ? "Encrypted" : "Decrypted"} using ${type.toUpperCase()} ${type === "aes" || type === "caesar" ? "🔐" : "🔧"} ${type === "aes" ? "with key." : ""}`;

const summary = `➤ ${action === "encrypt" ? "Encrypted" : "Decrypted"} using ${type.toUpperCase()} ${type === "aes" || type === "caesar" ? "🔐" : "🔧"} ${type === "aes" ? "with key." : ""}`;


  const autoNote = document.createElement("div");
  autoNote.textContent = summary;
  autoNote.className = "note-entry";
  document.getElementById("noteHistory").prepend(autoNote);
}


function clearScreen() {
  const confirmClear = confirm("⚠️ Do you really want to clear the screen?");
  if (!confirmClear) return;

  document.getElementById("message").value = "";
  document.getElementById("key").value = "";
  document.getElementById("result").value = "";
  document.getElementById("action").value = "encrypt";

  alert("🧽 Screen cleared!");
}


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
