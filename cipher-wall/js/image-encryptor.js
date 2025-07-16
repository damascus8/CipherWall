function encryptAndUploadImage() {
  const fileInput = document.getElementById("imageInput");
  const key = document.getElementById("imageKey").value.trim();

  if (!fileInput.files[0]) {
    alert("Please select an image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function () {
    const imageData = reader.result;

    const res = await fetch("https://cipherwall-backend.onrender.com/api/image/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageData, key })
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Image uploaded successfully!");

      // Display preview
      const preview = document.getElementById("imagePreview");
      preview.src = imageData;
      preview.hidden = false;

      // Generate QR
      const url = `https://cipherwall.vercel.app/image-view.html?id=${data.id}`;
      const qrContainer = document.getElementById("qrContainer");
      qrContainer.innerHTML = "";
      new QRCode(qrContainer, { text: url, width: 200, height: 200 });
    } else {
      alert("❌ Upload failed: " + data.error);
    }
  };

  reader.readAsDataURL(fileInput.files[0]);
}

async function decryptImage() {
  const id = document.getElementById("decryptId").value.trim();
  const key = document.getElementById("decryptKey").value.trim();

  if (!id) {
    alert("❗ Image ID required");
    return;
  }

  const res = await fetch("https://cipherwall-backend.onrender.com/api/image/decrypt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, key })
  });

  const data = await res.json();

  if (res.ok) {
    const img = document.getElementById("decryptedImage");
    img.src = data.decrypted;
    img.hidden = false;
  } else {
    alert("❌ Decryption failed: " + data.error);
  }
}