function renderLogin() {
  document.getElementById('app').innerHTML = `
    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <h1 class="login-logo">Vita OS</h1>
          <p class="login-subtitle">Pflegeabrechnung & Verwaltung</p>
        </div>
        <form onsubmit="submitLogin(event)" class="login-form">
          <div class="form-group">
            <label class="form-label">E-Mail</label>
            <input type="email" name="email" class="form-control" value="chef@vitakreis.de" required>
          </div>
          <div class="form-group">
            <label class="form-label">Passwort</label>
            <input type="password" name="password" class="form-control" value="admin123" required>
          </div>
          <button type="submit" class="btn btn--primary btn--full-width">Anmelden</button>
        </form>
        <div class="login-demo">
          <p class="text-muted">Demo-Zugänge:</p>
          ${DEMO_USERS.map(user => `
            <button class="demo-btn" onclick="quickLogin('${user.email}', '${user.password}')">
              ${user.role === 'admin' ? '👨‍💼' : '👨‍⚕️'} ${user.name}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function submitLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const user = DEMO_USERS.find(u => u.email === formData.get('email') && u.password === formData.get('password'));
  if (user) handleLogin(user);
  else showToast('Ungültige Anmeldedaten', 'error');
}

function quickLogin(email, password) {
  const user = DEMO_USERS.find(u => u.email === email);
  if (user) handleLogin(user);
}