function showModal(content, options = {}) {
  document.getElementById('modal-root').innerHTML = `
    <div class="modal-overlay" onclick="closeModal()">
      <div class="modal ${options.size || 'medium'}" onclick="event.stopPropagation()">
        ${content}
      </div>
    </div>
  `;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-root').innerHTML = '';
  document.body.style.overflow = '';
}

function showConfirm(message, onConfirm, title = 'Bestätigung') {
  showModal(`
    <div class="modal-header"><h2>${title}</h2></div>
    <div class="modal-body"><p>${message}</p></div>
    <div class="modal-footer">
      <button class="btn btn--secondary" onclick="closeModal()">Abbrechen</button>
      <button class="btn btn--primary" onclick="closeModal(); (${onConfirm})()">Bestätigen</button>
    </div>
  `);
}