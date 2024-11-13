document.getElementById('agree-checkbox').addEventListener('change', function() {
    const downloadButton = document.getElementById('download-button');
    downloadButton.disabled = !this.checked;
    if (this.checked) {
        downloadButton.style.backgroundColor = '#6200ea';
    } else {
        downloadButton.style.backgroundColor = '#444';
    }
});

document.getElementById('download-button').addEventListener('click', function() {
    window.location.href = 'files/setupv.0.0.5.exe';
});

async function getFileInfo() {
    const response = await fetch('files/setupv.0.0.5.exe');
    const buffer = await response.arrayBuffer();
    const file = new Uint8Array(buffer);

    const sha256 = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(file)).toString();
    const md5 = CryptoJS.MD5(CryptoJS.lib.WordArray.create(file)).toString();
    const crc32 = crc32Buffer(file);
    const size = (buffer.byteLength / (1024 * 1024)).toFixed(2) + ' MB';

    document.getElementById('sha256').textContent = sha256;
    document.getElementById('md5').textContent = md5;
    document.getElementById('crc32').textContent = crc32.toString(16).toUpperCase();
    document.getElementById('timestamp').textContent = new Date().toLocaleString();
    document.getElementById('size').textContent = size;
}

function crc32Buffer(buffer) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < buffer.length; i++) {
        crc = (crc >>> 8) ^ crc32Table[(crc ^ buffer[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
}

const crc32Table = (() => {
    let c;
    const table = [];
    for (let n = 0; n < 256; n++) {
        c = n;
        for (let k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        table[n] = c;
    }
    return table;
})();

getFileInfo();
