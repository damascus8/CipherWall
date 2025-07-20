// async function decryptImage() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const id = urlParams.get('id');
//   const key = document.getElementById('key-input').value;

//   if (!id || !key) {
//     alert('ID or key missing');
//     return;
//   }

//   try {
//     const res = await fetch(`https://cipherwall-backend.onrender.com/api/decrypt-image/${id}?key=${encodeURIComponent(key)}`);
//     if (!res.ok) throw new Error('Invalid key or image not found');

//     const blob = await res.blob();
//     const imgURL = URL.createObjectURL(blob);

//     const img = document.createElement('img');
//     img.src = imgURL;
    
//     const container = document.getElementById('image-container');
//     container.innerHTML = ''; // clear previous
//     container.appendChild(img);

//   } catch (err) {
//     alert('❌ Failed to decrypt: ' + err.message);
//   }
// }


async function decryptImage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const key = document.getElementById('key-input').value;
  const status = document.getElementById('status-message');
  const container = document.getElementById('image-container');
  const button = document.getElementById('decrypt-btn');

  if (!id || !key) {
    status.textContent = '❌ ID or key is missing.';
    return;
  }

  // Show loading status
  status.textContent = '🔄 Decrypting image...';
  container.innerHTML = '';
  button.disabled = true;
  button.textContent = 'Decrypting...';

  try {
    const res = await fetch(`https://cipherwall-backend.onrender.com/api/decrypt-image/${id}?key=${encodeURIComponent(key)}`);
    if (!res.ok) throw new Error('Invalid key or image not found.');

    const blob = await res.blob();
    const imgURL = URL.createObjectURL(blob);

    const img = document.createElement('img');
    img.src = imgURL;
    img.alt = 'Decrypted Image';

//
//adding downloader code
//
const downloadBtn = document.createElement('button');
downloadBtn.textContent = '⬇️ Download Image';
downloadBtn.id = 'download-btn';
downloadBtn.onclick = () => Downloader.downloadImage(imgURL, 'decrypted-image.png');

container.appendChild(downloadBtn);

//////



    container.innerHTML = '';
    container.appendChild(img);

    status.textContent = ''; // Clear error
  } catch (err) {
    status.textContent = '❌ Failed to decrypt: ' + err.message;
  }

  // Reset button
  button.disabled = false;
  button.textContent = '🔓 Unlock';
}
