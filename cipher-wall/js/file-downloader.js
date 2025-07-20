

 const Downloader = {
  // 🔹 Download plain text as a file
  downloadText: (content, filename = 'message.txt') => {
    const blob = new Blob([content], { type: 'text/plain' });
    Downloader._triggerDownload(blob, filename);
  },

  // 🔹 Download image (from URL or blob)
  downloadImage: (imageUrl, filename = 'image.png') => {
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => Downloader._triggerDownload(blob, filename))
      .catch(err => alert("❌ Failed to download image: " + err));
  },

  // 🔹 Download QR code (from <canvas>)
  downloadQRCodeCanvas: (canvas, filename = 'qrcode.png') => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  },

  // 🔹 Private helper method to trigger blob download
  _triggerDownload: (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

window.Downloader = Downloader;