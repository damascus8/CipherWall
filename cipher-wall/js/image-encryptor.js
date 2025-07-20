document.getElementById('encrypt-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const imageInput = document.getElementById('image-input');
  const passwordInput = document.getElementById('password-input');
  const encryptButton = document.getElementById('encrypt-button');
  const previewContainer = document.getElementById('preview-container');
  const imagePreview = document.getElementById('image-preview');
  const loading = document.getElementById('loading');
  const qrContainer = document.getElementById('qr-container');
  const qrCode = document.getElementById('qr-code');
  const encryptedLink = document.getElementById('encrypted-link');

  const imageFile = imageInput.files[0];
  const password = passwordInput.value;

  // 🔁 Reset previous state
  qrCode.innerHTML = '';
  encryptedLink.innerHTML = '';
  qrContainer.style.display = 'none';
  loading.style.display = 'none';

  if (!imageFile || !password) {
    alert("📸 Please select an image and enter a password.");
    return;
  }

  // ⏳ Disable button and show loading
  encryptButton.disabled = true;
  encryptButton.textContent = "Encrypting...";
  loading.style.display = 'block';

  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('password', password);

    const res = await fetch('https://cipherwall-backend.onrender.com/api/encrypt-image', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (!res.ok || !data || !data.id) {
      throw new Error(data.message || "Server returned no ID.");
    }

    // ✅ Construct encrypted URL
    const imageUrl = `${window.location.origin}/view-image.html?id=${data.id}`;

    // ✅ Generate QR Code
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, imageUrl);

    qrCode.appendChild(canvas);

    // ✅ Add download QR button
    const downloadQRBtn = document.createElement('button');
    downloadQRBtn.textContent = '⬇️ Download QR Code';
    downloadQRBtn.className = 'download-btn';
    downloadQRBtn.onclick = () => Downloader.downloadQRCodeCanvas(canvas, 'encrypted-qr.png');
    qrCode.appendChild(downloadQRBtn);

    // ✅ Add clickable link
    encryptedLink.href = imageUrl;
    encryptedLink.textContent = '🔗 Click here to view your encrypted image';
    qrContainer.style.display = 'block';

  } catch (err) {
    console.error('❌ Encryption error:', err);
    qrCode.innerHTML = `<p style="color:red;">❌ Failed to encrypt. Try again.</p>`;
    qrContainer.style.display = 'block';
  } finally {
    // ✅ Reset UI
    encryptButton.disabled = false;
    encryptButton.textContent = "🔐 Encrypt Image";
    loading.style.display = 'none';
  }
});
