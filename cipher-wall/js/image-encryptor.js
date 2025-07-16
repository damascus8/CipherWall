
// 🔐 Upload & Encrypt
async function uploadAndEncrypt() {
  const fileInput = document.getElementById("imageInput");
  const key = document.getElementById("encryptKey").value.trim();
  const result = document.getElementById("uploadResult");

  if (!fileInput.files.length || !key) {
    return alert("Please choose an image and enter a key.");
  }

  const formData = new FormData();
  formData.append("image", fileInput.files[0]);
  formData.append("key", key);

  try {
    const res = await fetch("https://cipherwall-backend.onrender.com/api/upload-image", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    result.textContent = `✅ Encrypted. Image ID: ${data.id}`;
  } catch (err) {
    result.textContent = "❌ " + err.message;
  }
}

// 🔓 Decrypt & Display Image
async function decryptAndShowImage() {
  const id = document.getElementById("imageId").value.trim();
  const key = document.getElementById("decryptKey").value.trim();
  const container = document.getElementById("decryptedImageArea");

  if (!id || !key) return alert("Enter both ID and key.");

  try {
    const res = await fetch("https://cipherwall-backend.onrender.com/api/decrypt-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, key })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error);
    }

    const blob = await res.blob();
    const imgURL = URL.createObjectURL(blob);

    container.innerHTML = `<img src="${imgURL}" alt="Decrypted Image" style="max-width:100%; margin-top:10px;" />`;
  } catch (err) {
    container.innerHTML = `<p style="color:red;">❌ ${err.message}</p>`;
  }
}