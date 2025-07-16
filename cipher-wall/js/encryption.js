// encryption.js

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

function encryptDecrypt({ message, key, type, action }) {
  let result = "";
  console.log(message);
  console.log(key);
  console.log(type);
  console.log(action);

  if (!message || (type === "aes" && !key)) {
    alert("Please enter message" + (type === "aes" ? " and key!" : "!"));
    return "";
  }

  switch (type) {
    case "aes":
      if (action === "encrypt") {
        result = CryptoJS.AES.encrypt(message, key).toString();
      } else {
        try {
          const bytes = CryptoJS.AES.decrypt(message, key);
          result = bytes.toString(CryptoJS.enc.Utf8);
          if (!result) throw "Failed";
        } catch {
          result = "❌ Decryption failed!";
        }
      }
      break;

    case "base64":
      try {
        result = action === "encrypt" ? btoa(message) : atob(message);
      } catch {
        result = "❌ Invalid Base64 input!";
      }
      break;

    // case "rot13":
    //   result = message.replace(/[a-zA-Z]/g, char => {
    //     const start = char <= "Z" ? 65 : 97;
    //     const offset = (char.charCodeAt(0) - start + 13) % 26;
    //     return String.fromCharCode(start + offset);
    //   });
case "rot13":
  if (action === "encrypt") {
    const rot = message.replace(/[a-zA-Z]/g, char => {
      const start = char <= "Z" ? 65 : 97;
      const offset = (char.charCodeAt(0) - start + 13) % 26;
      return String.fromCharCode(start + offset);
    });
    result = key ? `::${key}::${rot}` : rot;
  } else {
    if (key && message.startsWith(`::${key}::`)) {
      const clean = message.replace(`::${key}::`, "");
      result = clean.replace(/[a-zA-Z]/g, char => {
        const start = char <= "Z" ? 65 : 97;
        const offset = (char.charCodeAt(0) - start + 13) % 26;
        return String.fromCharCode(start + offset);
      });
    } else if (!key || !message.startsWith("::")) {
      result = message.replace(/[a-zA-Z]/g, char => {
        const start = char <= "Z" ? 65 : 97;
        const offset = (char.charCodeAt(0) - start + 13) % 26;
        return String.fromCharCode(start + offset);
      });
    } else {
      result = "❌ Incorrect password!";
    }
  }
  break;
  

    case "caesar":
      const shift = parseInt(key) || 0;
      if (!Number.isInteger(shift)) {
        return "❌ Caesar needs a numeric key!";
      }
      result = message.replace(/[a-zA-Z]/g, char => {
        const start = char <= "Z" ? 65 : 97;
        const offset = (char.charCodeAt(0) - start + (action === "encrypt" ? shift : 26 - shift)) % 26;
        return String.fromCharCode(start + offset);
      });
      break;

    case "morse":
      if (action === "encrypt") {
        result = message.toUpperCase().split('').map(ch => morseMap[ch] || '').join(' ');
      } else {
        try {
          result = message.split(' ').map(m => {
            if (!reverseMorse[m]) throw new Error();
            return reverseMorse[m];
          }).join('');
        } catch {
          result = "❌ Invalid Morse Code input!";
        }
      }
      break;
  }

  return result;
}


function decryptMorse(morseCode) {
  console.log("🔍 Decrypting Morse:", morseCode);
  
  const morseMap = {
    ".-": "A", "-...": "B", "-.-.": "C",
    "-..": "D", ".": "E", "..-.": "F",
    "--.": "G", "....": "H", "..": "I",
    ".---": "J", "-.-": "K", ".-..": "L",
    "--": "M", "-.": "N", "---": "O",
    ".--.": "P", "--.-": "Q", ".-.": "R",
    "...": "S", "-": "T", "..-": "U",
    "...-": "V", ".--": "W", "-..-": "X",
    "-.--": "Y", "--..": "Z",
    "-----": "0", ".----": "1", "..---": "2",
    "...--": "3", "....-": "4", ".....": "5",
    "-....": "6", "--...": "7", "---..": "8",
    "----.": "9",
    "/": " ",  // 🧠 space between words
  };

  if (!morseCode || typeof morseCode !== "string") return "";

  return morseCode
    .trim()
    .split(" ")
    .map(symbol => morseMap[symbol] || "?") // Use '?' as fallback to detect invalid symbols
    .join("");
}
