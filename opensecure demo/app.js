// =========================================================
// INITIAL APPLICATION STATE (ALIGNED WITH SYSTEM ARCHITECTURE)
// =========================================================
const state = {
  metrics: {
    requests: 48210,
    registeredApps: 12,
    consents: 341,
    threats: 87,
    scopeViolations: 24
  },

  recentRequests: [
    { time: '14:35', app: 'MoniFlex', request: 'GET /api/v1/balance', result: '200 OK', pill: 'pill-green' },
    { time: '14:38', app: 'MoniFlex', request: 'GET /api/v1/transactions', result: '200 OK', pill: 'pill-green' },
    { time: '14:40', app: 'QuickSave', request: 'POST /api/v1/payments', result: '403 Forbidden', pill: 'pill-red' },
    { time: '14:41', app: 'MoniFlex', request: 'GET /api/v1/accounts', result: '200 OK', pill: 'pill-green' },
    { time: '14:44', app: 'QuickSave', request: 'GET /api/v1/balance', result: '429 Throttled', pill: 'pill-amber' }
  ],

  securityIncidents: [
    { time: '14:40', event: 'Consent does not cover payments', app: 'QuickSave', ip: '102.89.34.12', endpoint: 'POST /api/v1/payments', action: 'Blocked', pill: 'pill-red' },
    { time: '14:12', event: 'Rate limit exceeded (5,000 req/min)', app: 'MoniFlex', ip: '197.210.55.8', endpoint: 'GET /api/v1/transactions', action: 'Blocked', pill: 'pill-red' },
    { time: '13:51', event: 'Expired access token', app: 'SaveWise', ip: '41.190.12.77', endpoint: 'GET /api/v1/accounts', action: 'Rejected', pill: 'pill-amber' },
    { time: '13:20', event: 'Injection pattern in query', app: 'Unknown', ip: '185.220.101.4', endpoint: 'GET /api/v1/balance', action: 'Blocked', pill: 'pill-red' }
  ],

  endpoints: [
    { id: 'ep-1', path: '/api/v1/accounts', method: 'GET', description: 'Retrieve customer accounts', rateLimit: 1000, latency: '42 ms', enabled: true },
    { id: 'ep-2', path: '/api/v1/balance', method: 'GET', description: 'Retrieve account balance', rateLimit: 1200, latency: '38 ms', enabled: true },
    { id: 'ep-3', path: '/api/v1/transactions', method: 'GET', description: 'Retrieve transaction history', rateLimit: 800, latency: '64 ms', enabled: true },
    { id: 'ep-4', path: '/api/v1/payments', method: 'POST', description: 'Initiate payment requests', rateLimit: 300, latency: '91 ms', enabled: true }
  ],

  applications: [
    {
      id: 'app-1',
      name: 'MoniFlex',
      category: 'Personal Finance',
      clientId: 'kc_tpp_moniflex_01',
      certThumbprint: 'a4:8f:19:c2:7d:04:e1:90:b3:52:6a:11:f8:29:4c:0e',
      scopes: ['accounts', 'balance', 'transactions'],
      status: 'Active'
    },
    {
      id: 'app-2',
      name: 'QuickSave',
      category: 'Payment Application',
      clientId: 'kc_tpp_quicksave_02',
      certThumbprint: '3c:71:9e:44:12:b8:09:d5:67:a1:20:8f:4e:93:1b:77',
      scopes: ['accounts', 'balance'],
      status: 'Active'
    },
    {
      id: 'app-3',
      name: 'SaveWise',
      category: 'Financial Management',
      clientId: 'kc_tpp_savewise_03',
      certThumbprint: '8d:20:5b:16:e9:43:7a:12:c8:94:01:3f:6d:52:8a:41',
      scopes: ['accounts', 'transactions'],
      status: 'Active'
    },
    {
      id: 'app-4',
      name: 'CrediPulse',
      category: 'Digital Lending',
      clientId: 'kc_tpp_credipulse_04',
      certThumbprint: '5f:12:8c:39:0a:67:d1:48:92:e3:74:25:b0:18:6c:95',
      scopes: ['accounts', 'balance', 'transactions'],
      status: 'Blocked'
    }
  ],

  blockedTpps: [
    {
      id: 'blk-1',
      appId: 'app-4',
      name: 'CrediPulse',
      clientId: 'kc_tpp_credipulse_04',
      reason: 'Fraud rule triggered: 42 rapid balance probes across unconsented accounts',
      blockedAt: '18/11/2026 – 12:14',
      status: 'Blocked'
    },
    {
      id: 'blk-2',
      appId: null,
      name: 'RoguePay-Client',
      clientId: 'kc_tpp_rogue_99',
      reason: 'Certificate-bound token mismatch (cnf.x5t#S256 != client TLS cert)',
      blockedAt: '18/11/2026 – 11:03',
      status: 'Blocked'
    }
  ],

  consents: [
    {
      id: 'CNS-2026-0891',
      customer: 'Tunde Adeyemi',
      bank: 'Meridian Trust Bank (0142••••88)',
      app: 'MoniFlex',
      permissions: ['Account information', 'Account balance', 'Transaction history'],
      granted: '10/11/2026',
      expires: '08/02/2027',
      status: 'Active'
    },
    {
      id: 'CNS-2026-0884',
      customer: 'Tunde Adeyemi',
      bank: 'Meridian Trust Bank (0142••••88)',
      app: 'QuickSave',
      permissions: ['Account information', 'Account balance'],
      granted: '02/11/2026',
      expires: '31/01/2027',
      status: 'Active'
    },
    {
      id: 'CNS-2026-0842',
      customer: 'Ngozi Nwosu',
      bank: 'Meridian Trust Bank (0198••••14)',
      app: 'SaveWise',
      permissions: ['Account information', 'Transaction history'],
      granted: '19/10/2026',
      expires: '17/01/2027',
      status: 'Active'
    }
  ],

  securityControls: [
    { name: 'mTLS & Certificate-Bound Tokens', protects: 'Stolen token replay & spoofed TPP identity', policy: 'RFC 8705 X.509 thumbprint bound to Keycloak JWT', status: 'Active' },
    { name: 'Local Keycloak JWKS Validation', protects: 'Forged, altered, or expired RS256 tokens', policy: 'Local signature, iss, aud & 300s exp verification', status: 'Active' },
    { name: 'Replay Protection (JTI Nonce Cache)', protects: 'Captured request & token replay attacks', policy: 'Single-use jti tracking + timestamp skew window', status: 'Active' },
    { name: 'Granular Consent Scope Engine', protects: 'Access beyond customer-approved permissions', policy: 'Mandatory endpoint-to-consent scope enforcement', status: 'Active' },
    { name: 'Behavioral Fraud & Velocity Rules', protects: 'Account enumeration & anomalous burst scraping', policy: 'Auto-quarantine TPP on threshold breach', status: 'Active' },
    { name: 'Input Validation & TLS >= 1.2', protects: 'SQLi/XSS payloads & in-transit eavesdropping', policy: 'Strict schema filtering + TLS 1.2/1.3 inbound', status: 'Active' }
  ],

  auditLogs: [
    { timestamp: '18/11/2026 – 14:44', app: 'QuickSave', event: 'GET /api/v1/balance', status: 'Blocked', description: '429 Throttled — Burst threshold exceeded', hash: '9f86d081884c7d65...e3b0c442' },
    { timestamp: '18/11/2026 – 14:41', app: 'MoniFlex', event: 'GET /api/v1/accounts', status: 'Successful', description: '200 OK — Verified consent CNS-2026-0891 + mTLS cert', hash: '4b227777d4dd1fc6...8f1b2c90' },
    { timestamp: '18/11/2026 – 14:40', app: 'QuickSave', event: 'POST /api/v1/payments', status: 'Blocked', description: '403 Forbidden — Consent CNS-2026-0884 lacks payments scope', hash: '7902699be42c8a8e...11d4a709' },
    { timestamp: '18/11/2026 – 14:38', app: 'MoniFlex', event: 'GET /api/v1/transactions', status: 'Successful', description: '200 OK — Verified consent CNS-2026-0891 + mTLS cert', hash: '2c26b46b68ffc68f...55a91e34' },
    { timestamp: '18/11/2026 – 14:35', app: 'MoniFlex', event: 'GET /api/v1/balance', status: 'Successful', description: '200 OK — Verified consent CNS-2026-0891 + mTLS cert', hash: '6b86b273ff34fce1...09c82b17' },
    { timestamp: '18/11/2026 – 13:51', app: 'SaveWise', event: 'GET /api/v1/accounts', status: 'Failed', description: '401 Unauthorized — Keycloak RS256 token expired (>300s)', hash: 'd4735e3a265e16ee...71f04d62' }
  ],

  attackResults: [
    { id: 1, vector: 'Unauthenticated GET /api/v1/accounts', category: 'Authentication & Token', target: '/api/v1/accounts', bankAlone: '200 OK (Data Leaked)', gateway: '401 Unauthorized (Blocked)' },
    { id: 2, vector: 'Forged JWT with "alg": "none" header', category: 'Authentication & Token', target: '/api/v1/balance', bankAlone: '200 OK (Accepted)', gateway: '401 Invalid Signature (Blocked)' },
    { id: 3, vector: 'JWT signed with attacker RSA private key', category: 'Authentication & Token', target: '/api/v1/transactions', bankAlone: '200 OK (Accepted)', gateway: '401 JWKS Mismatch (Blocked)' },
    { id: 4, vector: 'Expired Keycloak access token (>300s TTL)', category: 'Authentication & Token', target: '/api/v1/balance', bankAlone: '200 OK (Accepted)', gateway: '401 Token Expired (Blocked)' },
    { id: 5, vector: 'Token with tampered audience (aud) claim', category: 'Authentication & Token', target: '/api/v1/accounts', bankAlone: '200 OK (Accepted)', gateway: '401 Invalid Audience (Blocked)' },
    { id: 6, vector: 'POST /api/v1/payments with read-only consent', category: 'Consent & Scope', target: '/api/v1/payments', bankAlone: '201 Created (Transfer Executed)', gateway: '403 Scope Denied (Blocked)' },
    { id: 7, vector: 'GET /api/v1/transactions after customer revocation', category: 'Consent & Scope', target: '/api/v1/transactions', bankAlone: '200 OK (Data Leaked)', gateway: '403 Consent Revoked (Blocked)' },
    { id: 8, vector: 'Access attempt using expired consent record', category: 'Consent & Scope', target: '/api/v1/balance', bankAlone: '200 OK (Data Leaked)', gateway: '403 Consent Expired (Blocked)' },
    { id: 9, vector: 'Horizontal IDOR: querying another customer accountId', category: 'Consent & Scope', target: '/api/v1/accounts/0198', bankAlone: '200 OK (IDOR Breach)', gateway: '403 Account Mismatch (Blocked)' },
    { id: 10, vector: 'Connection without client X.509 mTLS certificate', category: 'Transport & Certificate', target: 'Gateway TLS Handshake', bankAlone: '200 OK (No mTLS)', gateway: 'TLS Handshake Rejected (Blocked)' },
    { id: 11, vector: 'Stolen MoniFlex JWT replayed with QuickSave mTLS cert', category: 'Transport & Certificate', target: '/api/v1/balance', bankAlone: '200 OK (Token Reused)', gateway: '401 Cert Binding Mismatch (Blocked)' },
    { id: 12, vector: 'Self-signed untrusted TPP client certificate', category: 'Transport & Certificate', target: 'Gateway TLS Handshake', bankAlone: '200 OK (Accepted)', gateway: '495 SSL Cert Error (Blocked)' },
    { id: 13, vector: 'Downgrade handshake using legacy TLS 1.0/1.1', category: 'Transport & Certificate', target: 'Gateway TLS Handshake', bankAlone: 'Connected (Weak Cipher)', gateway: 'Protocol Version Alert (Blocked)' },
    { id: 14, vector: 'Replay of captured valid request with identical jti', category: 'Replay & Rate Abuse', target: '/api/v1/payments', bankAlone: '201 Created (Duplicate Debit)', gateway: '409 Replay Detected (Blocked)' },
    { id: 15, vector: 'High-frequency scraping burst (5,000 req/min)', category: 'Replay & Rate Abuse', target: '/api/v1/transactions', bankAlone: '200 OK / Service Degraded', gateway: '429 Too Many Requests (Blocked)' },
    { id: 16, vector: 'Credential stuffing on token endpoint', category: 'Replay & Rate Abuse', target: '/oauth/token', bankAlone: '200 / Unlimited Tries', gateway: '429 Rate Throttled (Blocked)' },
    { id: 17, vector: 'Stale request timestamp outside 60s skew window', category: 'Replay & Rate Abuse', target: '/api/v1/balance', bankAlone: '200 OK (Accepted)', gateway: '401 Stale Request (Blocked)' },
    { id: 18, vector: "SQL injection in account filter (' OR '1'='1)", category: 'Injection & Fraud', target: '/api/v1/transactions', bankAlone: '500 SQL Error / Dump', gateway: '400 WAF Malformed Input (Blocked)' },
    { id: 19, vector: 'JSON payload smuggling / oversized body (>1MB)', category: 'Injection & Fraud', target: '/api/v1/payments', bankAlone: '500 Parser Exception', gateway: '413 Payload Rejected (Blocked)' },
    { id: 20, vector: 'XSS script injection in payment narration field', category: 'Injection & Fraud', target: '/api/v1/payments', bankAlone: '201 Stored in Ledger', gateway: '400 Schema Sanitization (Blocked)' },
    { id: 21, vector: 'Rapid balance enumeration across 40+ accounts', category: 'Injection & Fraud', target: '/api/v1/balance', bankAlone: '200 OK (Enumerated)', gateway: '403 Fraud Rule Quarantine (Blocked)' },
    { id: 22, vector: 'Off-hours high-value payment velocity spike', category: 'Injection & Fraud', target: '/api/v1/payments', bankAlone: '201 Created (Processed)', gateway: '403 Fraud Velocity Block (Blocked)' }
  ]
};

// =========================================================
// NAVIGATION & PORTAL SWITCHING
// =========================================================
document.querySelectorAll('.nav-item').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const target = btn.getAttribute('data-view');
    document.querySelectorAll('.view-section').forEach((sec) => sec.classList.remove('active'));
    document.getElementById(`view-${target}`).classList.add('active');
  });
});

document.getElementById('switch-to-customer').addEventListener('click', () => {
  switchPortal('customer');
});

function switchPortal(portal) {
  const adminEl = document.getElementById('admin-portal');
  const custEl = document.getElementById('customer-portal');

  if (portal === 'customer') {
    adminEl.classList.add('hidden');
    custEl.classList.remove('hidden');
    showCustomerStep('step-login');
  } else {
    custEl.classList.add('hidden');
    adminEl.classList.remove('hidden');
    renderAll();
  }
}

function showCustomerStep(stepId) {
  document.querySelectorAll('.customer-step').forEach((s) => s.classList.remove('active'));
  document.getElementById(stepId).classList.add('active');

  document.querySelectorAll('.customer-nav-actions .btn-ghost').forEach((b) => b.classList.remove('active-step'));
  if (stepId === 'step-login') document.getElementById('cust-nav-auth').classList.add('active-step');
  if (stepId === 'step-authorise') document.getElementById('cust-nav-consent').classList.add('active-step');
  if (stepId === 'step-my-consents') {
    document.getElementById('cust-nav-my').classList.add('active-step');
    renderCustomerConsents();
  }
}

// =========================================================
// RENDERING FUNCTIONS
// =========================================================
function renderAll() {
  renderOverview();
  renderApiManagement();
  renderApplications();
  renderAdminConsents();
  renderSecurityCenter();
  renderAuditLogs();
  renderAttackResults();
  renderCustomerConsents();
}

function renderOverview() {
  document.getElementById('kpi-requests').textContent = state.metrics.requests.toLocaleString();
  document.getElementById('kpi-apps').textContent = state.metrics.registeredApps;
  document.getElementById('kpi-consents').textContent = state.metrics.consents;
  document.getElementById('kpi-threats').textContent = state.metrics.threats;

  const reqBody = document.getElementById('overview-requests-body');
  reqBody.innerHTML = state.recentRequests
    .slice(0, 5)
    .map(
      (r) => `
      <tr>
        <td>${r.time}</td>
        <td>${r.app}</td>
        <td>${r.request}</td>
        <td><span class="status-pill ${r.pill}">${r.result}</span></td>
      </tr>`
    )
    .join('');

  const incBody = document.getElementById('overview-incidents-body');
  incBody.innerHTML = state.securityIncidents
    .slice(0, 4)
    .map(
      (inc) => `
      <tr>
        <td>${inc.time}</td>
        <td>${inc.event}</td>
        <td>${inc.app}</td>
        <td><span class="status-pill ${inc.pill}">${inc.action}</span></td>
      </tr>`
    )
    .join('');
}

function renderApiManagement() {
  const tbody = document.getElementById('api-endpoints-body');
  tbody.innerHTML = state.endpoints
    .map(
      (ep) => `
      <tr>
        <td class="mono text-xs"><strong>${ep.path}</strong></td>
        <td><span class="status-pill pill-blue">${ep.method}</span></td>
        <td>${ep.description}</td>
        <td>${ep.rateLimit} req/min</td>
        <td>${ep.latency}</td>
        <td>
          <span class="status-pill ${ep.enabled ? 'pill-green' : 'pill-gray'}">
            ${ep.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="toggleEndpoint('${ep.id}')">
            ${ep.enabled ? 'Disable' : 'Enable'}
          </button>
        </td>
      </tr>`
    )
    .join('');

  const docCards = document.getElementById('api-doc-cards');
  docCards.innerHTML = state.endpoints
    .map(
      (ep) => `
      <div class="spec-box">
        <div class="mono text-xs"><strong>${ep.method} ${ep.path}</strong></div>
        <div class="text-xs text-muted mt-8">${ep.description}</div>
        <div class="text-xs mt-8">Scope: <code class="code-inline">${ep.path.split('/').pop()}</code></div>
      </div>`
    )
    .join('');
}

function renderApplications() {
  const tbody = document.getElementById('applications-body');
  tbody.innerHTML = state.applications
    .map(
      (app) => `
      <tr>
        <td>
          <div><strong>${app.name}</strong></div>
          <div class="text-xs text-muted">${app.category}</div>
        </td>
        <td>${app.category}</td>
        <td class="mono text-xs">${app.clientId}</td>
        <td class="mono text-xs" title="${app.certThumbprint}">${app.certThumbprint.slice(0, 23)}…</td>
        <td>${app.scopes.map((s) => `<code class="code-inline">${s}</code>`).join(' ')}</td>
        <td>
          <span class="status-pill ${app.status === 'Active' ? 'pill-green' : 'pill-red'}">
            ${app.status}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-outline btn-sm" onclick="viewAppCredentials('${app.id}')">Cert Binding</button>
            <button class="btn btn-outline btn-sm" onclick="toggleAppStatus('${app.id}')">
              ${app.status === 'Active' ? 'Suspend' : 'Approve'}
            </button>
          </div>
        </td>
      </tr>`
    )
    .join('');
}

function renderAdminConsents() {
  const tbody = document.getElementById('admin-consents-body');
  tbody.innerHTML = state.consents
    .map(
      (c) => `
      <tr>
        <td class="mono text-xs"><strong>${c.id}</strong></td>
        <td>
          <div><strong>${c.customer}</strong></div>
          <div class="text-xs text-muted">${c.bank}</div>
        </td>
        <td>${c.app}</td>
        <td>${c.permissions.map((p) => `<span class="status-pill pill-blue" style="margin:2px;">${p}</span>`).join('')}</td>
        <td class="text-xs">
          <div>Granted: ${c.granted}</div>
          <div class="text-muted">Expires: ${c.expires}</div>
        </td>
        <td>
          <span class="status-pill ${c.status === 'Active' ? 'pill-green' : 'pill-red'}">${c.status}</span>
        </td>
        <td>
          ${
            c.status === 'Active'
              ? `<button class="btn btn-danger-soft btn-sm" onclick="revokeConsent('${c.id}', 'Admin')">Revoke</button>`
              : `<span class="text-xs text-muted">Revoked</span>`
          }
        </td>
      </tr>`
    )
    .join('');
}

function renderSecurityCenter() {
  document.getElementById('sec-scope-violations').textContent = state.metrics.scopeViolations;

  document.getElementById('security-controls-body').innerHTML = state.securityControls
    .map(
      (ctrl) => `
      <tr>
        <td><strong>${ctrl.name}</strong></td>
        <td>${ctrl.protects}</td>
        <td class="text-muted">${ctrl.policy}</td>
        <td><span class="status-pill pill-green">${ctrl.status}</span></td>
      </tr>`
    )
    .join('');

  const blockedBody = document.getElementById('blocked-tpps-body');
  if (state.blockedTpps.length === 0) {
    blockedBody.innerHTML = `<tr><td colspan="6" class="text-muted text-sm">No third-party applications are currently blocked.</td></tr>`;
  } else {
    blockedBody.innerHTML = state.blockedTpps
      .map(
        (b) => `
        <tr>
          <td><strong>${b.name}</strong></td>
          <td class="mono text-xs">${b.clientId}</td>
          <td class="text-muted">${b.reason}</td>
          <td class="mono text-xs">${b.blockedAt}</td>
          <td><span class="status-pill pill-red">${b.status}</span></td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="unblockTpp('${b.id}')">Unblock</button>
          </td>
        </tr>`
      )
      .join('');
  }

  document.getElementById('security-incidents-full-body').innerHTML = state.securityIncidents
    .map(
      (inc) => `
      <tr>
        <td>18/11/2026 – ${inc.time}</td>
        <td><strong>${inc.event}</strong></td>
        <td>${inc.app} <span class="mono text-xs text-muted">(${inc.ip})</span></td>
        <td class="mono text-xs">${inc.endpoint}</td>
        <td><span class="status-pill ${inc.pill}">${inc.action}</span></td>
      </tr>`
    )
    .join('');
}

function renderAuditLogs() {
  const query = (document.getElementById('log-search')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('log-status-filter')?.value || 'ALL';

  const filtered = state.auditLogs.filter((log) => {
    const matchesQuery =
      log.app.toLowerCase().includes(query) ||
      log.event.toLowerCase().includes(query) ||
      log.description.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  document.getElementById('audit-logs-body').innerHTML = filtered
    .map((log) => {
      const pill =
        log.status === 'Successful' ? 'pill-green' : log.status === 'Blocked' ? 'pill-red' : 'pill-amber';
      return `
      <tr>
        <td class="mono text-xs">${log.timestamp}</td>
        <td><strong>${log.app}</strong></td>
        <td class="mono text-xs">${log.event}</td>
        <td><span class="status-pill ${pill}">${log.status}</span></td>
        <td class="text-muted">${log.description}</td>
        <td class="mono text-xs" style="color:#475569;">${log.hash}</td>
      </tr>`;
    })
    .join('');
}

function renderAttackResults() {
  const cat = document.getElementById('attack-cat-filter')?.value || 'ALL';
  const rows = state.attackResults.filter((r) => cat === 'ALL' || r.category === cat);

  document.getElementById('attack-results-body').innerHTML = rows
    .map(
      (r) => `
      <tr>
        <td class="mono text-xs">${r.id}</td>
        <td><strong>${r.vector}</strong></td>
        <td><span class="status-pill pill-gray">${r.category}</span></td>
        <td class="mono text-xs">${r.target}</td>
        <td><span class="status-pill pill-red">${r.bankAlone}</span></td>
        <td><span class="status-pill pill-green">${r.gateway}</span></td>
      </tr>`
    )
    .join('');
}

function renderCustomerConsents() {
  const container = document.getElementById('customer-consents-list');
  const customerConsents = state.consents.filter((c) => c.customer === 'Tunde Adeyemi');

  container.innerHTML = customerConsents
    .map(
      (c) => `
      <div class="card cust-consent-item">
        <div>
          <div style="display:flex; align-items:center; gap:10px;">
            <strong style="font-size:16px;">${c.app}</strong>
            <span class="status-pill ${c.status === 'Active' ? 'pill-green' : 'pill-red'}">${c.status}</span>
          </div>
          <p class="text-xs text-muted mt-8">
            Connected Account: ${c.bank} &bull; Authorised: ${c.granted} &bull; Expires: ${c.expires}
          </p>
          <div class="scope-tags">
            ${c.permissions.map((p) => `<span class="status-pill pill-blue">${p}</span>`).join('')}
          </div>
        </div>
        <div>
          ${
            c.status === 'Active'
              ? `<button class="btn btn-danger-soft btn-sm" onclick="revokeConsent('${c.id}', 'Customer')">Revoke Access</button>`
              : `<span class="text-xs text-muted">Access Revoked</span>`
          }
        </div>
      </div>`
    )
    .join('');
}

// =========================================================
// INTERACTIVE ACTIONS & DIFFERENTIATOR HANDLERS
// =========================================================
function getCurrentTimeStr() {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

function generateChainHash() {
  const hex = '0123456789abcdef';
  let prefix = '';
  let suffix = '';
  for (let i = 0; i < 16; i++) prefix += hex[Math.floor(Math.random() * 16)];
  for (let i = 0; i < 8; i++) suffix += hex[Math.floor(Math.random() * 16)];
  return `${prefix}...${suffix}`;
}

function pushAuditLog(app, event, status, description) {
  state.auditLogs.unshift({
    timestamp: `18/11/2026 – ${getCurrentTimeStr()}`,
    app,
    event,
    status,
    description,
    hash: generateChainHash()
  });
}

function verifyAuditIntegrity() {
  const banner = document.getElementById('integrity-banner');
  banner.textContent = `Integrity Verified: All ${state.auditLogs.length} audit records match their SHA-256 hash-chain links (0 tampered entries detected).`;
  banner.classList.remove('hidden');
  showToast('SHA-256 audit log chain verified — 100% intact');
}

function unblockTpp(blockId) {
  const idx = state.blockedTpps.findIndex((b) => b.id === blockId);
  if (idx === -1) return;
  const [removed] = state.blockedTpps.splice(idx, 1);

  if (removed.appId) {
    const app = state.applications.find((a) => a.id === removed.appId);
    if (app) app.status = 'Active';
  }

  pushAuditLog(
    'Gateway Admin',
    `UNBLOCK TPP ${removed.name}`,
    'Successful',
    `Cleared quarantine lock for ${removed.name} (${removed.clientId})`
  );

  renderAll();
  showToast(`${removed.name} unblocked and restored to Active`);
}

function toggleEndpoint(id) {
  const ep = state.endpoints.find((e) => e.id === id);
  if (!ep) return;
  ep.enabled = !ep.enabled;
  pushAuditLog(
    'Gateway Admin',
    `CONFIG ${ep.path}`,
    'Successful',
    `Endpoint ${ep.path} ${ep.enabled ? 'enabled' : 'disabled'} by administrator`
  );
  renderApiManagement();
  renderAuditLogs();
  showToast(`${ep.path} is now ${ep.enabled ? 'Enabled' : 'Disabled'}`);
}

function handleAddEndpoint(e) {
  e.preventDefault();
  const path = document.getElementById('new-api-path').value.trim();
  const method = document.getElementById('new-api-method').value;
  const description = document.getElementById('new-api-desc').value.trim();
  const rateLimit = parseInt(document.getElementById('new-api-rate').value, 10);

  state.endpoints.push({
    id: `ep-${Date.now()}`,
    path,
    method,
    description,
    rateLimit,
    latency: '35 ms',
    enabled: true
  });

  pushAuditLog('Gateway Admin', `REGISTER ${path}`, 'Successful', `Registered new ${method} endpoint (${rateLimit} req/min)`);
  closeModal('modal-new-api');
  e.target.reset();
  renderApiManagement();
  renderAuditLogs();
  showToast(`Registered ${method} ${path}`);
}

function handleAddApp(e) {
  e.preventDefault();
  const name = document.getElementById('new-app-name').value.trim();
  const category = document.getElementById('new-app-cat').value;
  const certThumbprint = document.getElementById('new-app-cert').value.trim();
  const scopes = Array.from(document.querySelectorAll('input[name="app-scope"]:checked')).map((cb) => cb.value);

  const clientId = `kc_tpp_${name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8)}_${Math.floor(10 + Math.random() * 89)}`;

  const newApp = {
    id: `app-${Date.now()}`,
    name,
    category,
    clientId,
    certThumbprint,
    scopes: scopes.length ? scopes : ['accounts'],
    status: 'Active'
  };

  state.applications.unshift(newApp);
  state.metrics.registeredApps += 1;
  pushAuditLog('Gateway Admin', `BIND CERT ${name}`, 'Successful', `Bound mTLS certificate ${certThumbprint.slice(0, 17)}… to Keycloak client ${clientId}`);

  closeModal('modal-new-app');
  e.target.reset();
  renderAll();
  viewAppCredentials(newApp.id);
}

function viewAppCredentials(appId) {
  const app = state.applications.find((a) => a.id === appId);
  if (!app) return;
  document.getElementById('cred-modal-title').textContent = `${app.name} — Certificate-Bound Identity`;
  document.getElementById('cred-client-id').value = app.clientId;
  document.getElementById('cred-cert-fp').value = app.certThumbprint;
  openModal('modal-credentials');
}

function toggleAppStatus(appId) {
  const app = state.applications.find((a) => a.id === appId);
  if (!app) return;
  app.status = app.status === 'Active' ? 'Blocked' : 'Active';
  pushAuditLog(
    'Gateway Admin',
    `APP STATUS ${app.name}`,
    app.status === 'Active' ? 'Successful' : 'Blocked',
    `Application ${app.name} status changed to ${app.status}`
  );
  renderAll();
  showToast(`${app.name} is now ${app.status}`);
}

function revokeConsent(consentId, actor) {
  const consent = state.consents.find((c) => c.id === consentId);
  if (!consent || consent.status !== 'Active') return;

  consent.status = 'Revoked';
  state.metrics.consents = Math.max(0, state.metrics.consents - 1);

  pushAuditLog(
    consent.app,
    `REVOKE CONSENT ${consent.id}`,
    'Blocked',
    `Consent revoked by ${actor} for ${consent.customer}. Subsequent API calls rejected.`
  );

  renderAll();
  showToast(`Consent ${consentId} revoked — API access immediately blocked`);
}

function simulateThreatEvent() {
  const time = getCurrentTimeStr();
  state.metrics.threats += 1;
  state.metrics.scopeViolations += 1;

  state.securityIncidents.unshift({
    time,
    event: 'Unauthorised payment initiation attempt',
    app: 'QuickSave',
    ip: '102.89.34.12',
    endpoint: 'POST /api/v1/payments',
    action: 'Blocked',
    pill: 'pill-red'
  });

  state.recentRequests.unshift({
    time,
    app: 'QuickSave',
    request: 'POST /api/v1/payments',
    result: '403 Forbidden',
    pill: 'pill-red'
  });

  pushAuditLog(
    'QuickSave',
    'POST /api/v1/payments',
    'Blocked',
    '403 Forbidden — Blocked by Consent Validation Engine (payments scope denied)'
  );

  renderAll();
  showToast('Blocked unauthorised POST /api/v1/payments from QuickSave (403 Forbidden)');
}

function saveGatewayConfig() {
  const rate = document.getElementById('cfg-rate-limit').value;
  pushAuditLog(
    'Gateway Admin',
    'UPDATE RUNTIME POLICY',
    'Successful',
    `Updated global TPP burst rate limit to ${rate} req/min`
  );
  renderAuditLogs();
  showToast('Gateway runtime policy saved');
}

// =========================================================
// CUSTOMER CONSENT PORTAL FLOW (SIMULATED UI PREVIEW)
// =========================================================
function handleCustomerLogin(e) {
  e.preventDefault();
  pushAuditLog(
    'Customer Portal',
    'CUSTOMER PKCE LOGIN',
    'Successful',
    'Tunde Adeyemi authenticated via Keycloak PKCE flow (simulated UI preview)'
  );
  showCustomerStep('step-authorise');
  showToast('Identity verified (Simulated UI flow)');
}

function approveCustomerConsent() {
  const checked = Array.from(document.querySelectorAll('#permission-toggles input[type="checkbox"]:checked'));
  if (checked.length === 0) {
    showToast('Select at least one permission or click Deny Request');
    return;
  }

  const permissions = checked.map((cb) => cb.getAttribute('data-label'));
  const newConsentId = `CNS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  state.consents.unshift({
    id: newConsentId,
    customer: 'Tunde Adeyemi',
    bank: 'Meridian Trust Bank (0142••••88)',
    app: 'MoniFlex',
    permissions,
    granted: '18/11/2026',
    expires: '16/02/2027',
    status: 'Active'
  });

  state.metrics.consents += 1;

  pushAuditLog(
    'MoniFlex',
    `GRANT CONSENT ${newConsentId}`,
    'Successful',
    `Customer granted [${permissions.join(', ')}] via consent portal.`
  );

  showCustomerStep('step-my-consents');
  showToast(`Consent ${newConsentId} approved!`);
}

function rejectCustomerConsent() {
  pushAuditLog(
    'MoniFlex',
    'DENY CONSENT REQUEST',
    'Blocked',
    'Customer Tunde Adeyemi rejected authorisation request'
  );
  showCustomerStep('step-my-consents');
  showToast('Authorisation request denied');
}

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3200);
}

renderAll();