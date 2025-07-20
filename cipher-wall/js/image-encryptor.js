// document.getElementById('encrypt-form').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const imageFile = document.getElementById('image-input').files[0];
//   const password = document.getElementById('password-input').value;

//   const formData = new FormData();
//   formData.append('image', imageFile);
//   formData.append('password', password);

//   const res = await fetch('https://cipherwall-backend.onrender.com/api/encrypt-image', {
//     method: 'POST',
//     body: formData
//   });
// // 
//   const data = await res.json();
//   // const imageUrl = `${window.location.origin}/api/decrypt-image/${data.id}?key=${encodeURIComponent(password)}`;

//   const imageUrl = `${window.location.origin}/view-image.html?id=${data.id}`;

//   const qrContainer = document.getElementById('qr-container');
//   qrContainer.innerHTML = '';
//   QRCode.toCanvas(document.createElement('canvas'), imageUrl, (err, canvas) => {
//     if (!err) qrContainer.appendChild(canvas);
    
//   });


// // ✅ Also show direct URL
// const urlLink = document.createElement('a');
// urlLink.href = imageUrl;
// urlLink.textContent = '🔗 Click here to view image directly';
// urlLink.style.display = 'block';
// urlLink.style.marginTop = '15px';
// urlLink.style.color = '#0ff';
// urlLink.style.fontSize = '1rem';
// urlLink.target = '_blank';
// qrContainer.appendChild(urlLink);

// });
/////////////////////////


document.getElementById('encrypt-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const imageInput = document.getElementById('image-input');
  const passwordInput = document.getElementById('password-input');
  const previewContainer = document.getElementById('preview-container');
  const imagePreview = document.getElementById('image-preview');
  const loading = document.getElementById('loading');
  const qrContainer = document.getElementById('qr-container');
  const qrCode = document.getElementById('qr-code');
  const encryptedLink = document.getElementById('encrypted-link');

  const imageFile = imageInput.files[0];
  const password = passwordInput.value;

  // ✅ Show image preview
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.src = reader.result;
      previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(imageFile);
  }

  // ✅ Hide previous results
  qrCode.innerHTML = '';
  encryptedLink.innerHTML = '';
  qrContainer.style.display = 'none';

  // ✅ Show loading
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

    if (!data || !data.id) {
      throw new Error("Invalid response from server");
    }

    // ✅ Construct encrypted image URL
    const imageUrl = `${window.location.origin}/view-image.html?id=${data.id}`;

    // ✅ Generate QR Code
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, imageUrl);
    qrCode.appendChild(canvas);

    // ✅ Setup clickable link
    encryptedLink.href = imageUrl;
    encryptedLink.textContent = '🔗 Click here to visit the PATH';

    // ✅ Show QR and link container
    qrContainer.style.display = 'block';
  } catch (err) {
    console.error('Encryption error:', err);
    qrCode.innerHTML = `<p style="color:red;">❌ Error encrypting image. Try again.</p>`;
    qrContainer.style.display = 'block';
  } finally {
    loading.style.display = 'none';
  }
});
