let signatureCanvas, signatureCtx, isDrawing = false;

function SignaturePad(besuchId) {
  return `
    <div class="signature-pad-container">
      <div class="modal-header">
        <h2>Unterschrift erfassen</h2>
        <button class="btn-icon" onclick="closeModal()">✕</button>
      </div>
      <div class="signature-canvas-wrapper">
        <canvas id="signature-canvas" width="600" height="300"></canvas>
        <div class="signature-hint">Bitte hier unterschreiben</div>
      </div>
      <div class="signature-actions">
        <button class="btn btn--secondary" onclick="clearSignature()">🗑️ Löschen</button>
        <button class="btn btn--primary" onclick="saveSignature(${besuchId})">✓ Speichern</button>
      </div>
    </div>
  `;
}

function openSignaturePad(besuchId) {
  showModal(SignaturePad(besuchId));
  setTimeout(() => {
    signatureCanvas = document.getElementById('signature-canvas');
    signatureCtx = signatureCanvas.getContext('2d');
    signatureCtx.strokeStyle = '#000';
    signatureCtx.lineWidth = 2;
    signatureCtx.lineCap = 'round';

    signatureCanvas.addEventListener('touchstart', startDrawing);
    signatureCanvas.addEventListener('touchmove', draw);
    signatureCanvas.addEventListener('touchend', stopDrawing);
    signatureCanvas.addEventListener('mousedown', startDrawing);
    signatureCanvas.addEventListener('mousemove', draw);
    signatureCanvas.addEventListener('mouseup', stopDrawing);
  }, 100);
}

function startDrawing(e) {
  isDrawing = true;
  const pos = getPosition(e);
  signatureCtx.beginPath();
  signatureCtx.moveTo(pos.x, pos.y);
}

function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  const pos = getPosition(e);
  signatureCtx.lineTo(pos.x, pos.y);
  signatureCtx.stroke();
}

function stopDrawing() {
  isDrawing = false;
}

function getPosition(e) {
  const rect = signatureCanvas.getBoundingClientRect();
  const touch = e.touches ? e.touches[0] : e;
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top
  };
}

function clearSignature() {
  signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
}

function saveSignature(besuchId) {
  const dataURL = signatureCanvas.toDataURL();
  const besuch = besuchsData.find(b => b.id === besuchId);
  if (besuch) {
    besuch.unterschrift = dataURL;
  }
  showToast('✓ Unterschrift gespeichert');
  closeModal();
  if (currentRoute === 'besuche') renderBesuche();
}