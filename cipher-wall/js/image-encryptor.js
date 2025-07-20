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

  const imageFile = document.getElementById('image-input').files[0];
  const password = document.getElementById('password-input').value;

  const encryptBtn = document.getElementById('encrypt-button');
  const qrContainer = document.getElementById('qr-container');

  // 🌐 UI loading state
  encryptBtn.disabled = true;
  encryptBtn.innerHTML = '🔄 Encrypting... Please wait';
  qrContainer.innerHTML = `
    <div style="color: #0ff; font-size: 1rem; margin-top: 10px;">
      🔐 Processing your image securely...
    </div>
  `;

  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('password', password);

  try {
    const res = await fetch('https://cipherwall-backend.onrender.com/api/encrypt-image', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    const imageUrl = `${window.location.origin}/view-image.html?id=${data.id}`;

    // 🎯 Clear and generate QR
    qrContainer.innerHTML = '';
    const canvas = document.createElement('canvas');

    QRCode.toCanvas(canvas, imageUrl, (err) => {
      if (!err) {
        canvas.style.border = '2px solid #0ff';
        canvas.style.marginTop = '10px';
        canvas.style.padding = '10px';
        qrContainer.appendChild(canvas);
      } else {
        qrContainer.innerHTML = `<p style="color: red;">❌ Error generating QR.</p>`;
      }
    });

    // 🔗 Create direct link
    const urlLink = document.createElement('a');
    urlLink.href = imageUrl;
    urlLink.textContent = '🔗 Click here to view encrypted image';
    urlLink.style.display = 'block';
    urlLink.style.marginTop = '15px';
    urlLink.style.color = '#0ff';
    urlLink.style.fontSize = '1rem';
    urlLink.target = '_blank';
    qrContainer.appendChild(urlLink);

  } catch (err) {
    console.error(err);
    qrContainer.innerHTML = `<p style="color: red;">❌ Error encrypting image.</p>`;
  }

  // ✅ Reset button
  encryptBtn.disabled = false;
  encryptBtn.innerHTML = '🔐 Encrypt Image';
});

