const express = require('express');
const router  = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { aesEncrypt, aesDecrypt, sha256Hash, generateRSAKeyPair, rsaSign, rsaVerify } = require('../security/crypto');
const db = require('../db/database');

router.post('/encrypt',      authenticateToken, (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });
  res.json({ encrypted: aesEncrypt(text), algorithm: 'AES-256-CBC' });
});

router.post('/decrypt',      authenticateToken, (req, res) => {
  try { res.json({ decrypted: aesDecrypt(req.body.ciphertext) }); }
  catch { res.status(400).json({ error: 'Decryption failed' }); }
});

router.post('/hash',         (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });
  res.json({ hash: sha256Hash(text), algorithm: 'SHA-256' });
});

router.post('/rsa/generate', authenticateToken, (req, res) => {
  res.json({ ...generateRSAKeyPair(), keySize: 2048 });
});

router.post('/rsa/sign',     authenticateToken, (req, res) => {
  try { res.json({ signature: rsaSign(req.body.privateKey, req.body.data) }); }
  catch { res.status(400).json({ error: 'Signing failed' }); }
});

router.post('/rsa/verify',   (req, res) => {
  const { publicKey, data, signature } = req.body;
  res.json({ valid: rsaVerify(publicKey, data, signature) });
});

router.get('/audit-logs',    authenticateToken, (req, res) => {
  res.json(db.prepare(`
    SELECT al.*, u.username FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC LIMIT 100
  `).all());
});

module.exports = router;