document.getElementById('encrypt-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const imageFile = document.getElementById('image-input').files[0];
  const password = document.getElementById('password-input').value;

  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('password', password);

  const res = await fetch('/api/encrypt-image', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  const imageUrl = `${window.location.origin}/api/decrypt-image/${data.id}?key=${encodeURIComponent(password)}`;

  const qrContainer = document.getElementById('qr-container');
  qrContainer.innerHTML = '';
  QRCode.toCanvas(document.createElement('canvas'), imageUrl, (err, canvas) => {
    if (!err) qrContainer.appendChild(canvas);
    
  });


// ✅ Also show direct URL
const urlLink = document.createElement('a');
urlLink.href = imageUrl;
urlLink.textContent = '🔗 Click here to view image directly';
urlLink.style.display = 'block';
urlLink.style.marginTop = '15px';
urlLink.style.color = '#0ff';
urlLink.style.fontSize = '1rem';
urlLink.target = '_blank';

qrContainer.appendChild(urlLink);




});