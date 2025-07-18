async function encryptAndUploadImage(file, password) {
  const reader = new FileReader();
  reader.onload = async () => {
    const arrayBuffer = reader.result;
    const encrypted = await encryptImage(arrayBuffer, password);

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: JSON.stringify({ data: encrypted, password }),
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();
    if (result.success) {
      const qrData = `${window.location.origin}/image-view.html?id=${result.id}`;
      generateQRCode(qrData); // show QR with the ID
    }
  };
  reader.readAsArrayBuffer(file);
}

async function encryptImage(buffer, password) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    buffer
  );

  return {
    iv: Array.from(iv),
    encrypted: Array.from(new Uint8Array(encrypted))
  };
}