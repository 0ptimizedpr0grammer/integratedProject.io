const crypto = require('crypto');
const AES_KEY = Buffer.from(process.env.AES_KEY || '0123456789abcdef0123456789abcdef', 'utf8');

function aesEncrypt(plaintext) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, iv);
  const encrypted = cipher.update(String(plaintext), 'utf8', 'hex') + cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function aesDecrypt(ciphertext) {
  const [ivHex, encrypted] = ciphertext.split(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, Buffer.from(ivHex, 'hex'));
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}

function sha256Hash(data) {
  return crypto.createHash('sha256').update(String(data)).digest('hex');
}

function generateRSAKeyPair() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding:  { type: 'spki',  format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
}

function rsaSign(privateKey, data) {
  const sign = crypto.createSign('SHA256');
  sign.update(String(data));
  return sign.sign(privateKey, 'hex');
}

function rsaVerify(publicKey, data, signature) {
  try {
    const verify = crypto.createVerify('SHA256');
    verify.update(String(data));
    return verify.verify(publicKey, signature, 'hex');
  } catch { return false; }
}

module.exports = { aesEncrypt, aesDecrypt, sha256Hash, generateRSAKeyPair, rsaSign, rsaVerify };