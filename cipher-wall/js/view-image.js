async function decryptImage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const key = document.getElementById('key-input').value;

  if (!id || !key) {
    alert('ID or key missing');
    return;
  }

  try {
    const res = await fetch(`https://cipherwall-backend.onrender.com/api/decrypt-image/${id}?key=${encodeURIComponent(key)}`);
    if (!res.ok) throw new Error('Invalid key or image not found');

    const blob = await res.blob();
    const imgURL = URL.createObjectURL(blob);

    const img = document.createElement('img');
    img.src = imgURL;
    
    const container = document.getElementById('image-container');
    container.innerHTML = ''; // clear previous
    container.appendChild(img);

  } catch (err) {
    alert('❌ Failed to decrypt: ' + err.message);
  }
}
