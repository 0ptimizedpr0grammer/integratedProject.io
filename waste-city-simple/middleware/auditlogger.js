const db = require('../db/database');
const { sha256Hash } = require('../security/crypto');

function auditLog(action, resource) {
  return (req, res, next) => {
    try {
      db.prepare('INSERT INTO audit_logs (user_id,action,resource,ip_address,payload_hash) VALUES (?,?,?,?,?)')
        .run(req.user?.id || null, action, resource, req.ip, sha256Hash(JSON.stringify({ body: req.body, params: req.params })));
    } catch {}
    next();
  };
}

module.exports = { auditLog };