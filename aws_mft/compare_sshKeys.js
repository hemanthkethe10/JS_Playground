const crypto = require('crypto');

function keysMatch(publicKeyPem, privateKeyPem) {
  try {
    // Generate some random data to encrypt
    const data = Buffer.from('test data for key match');

    // Encrypt with public key
    const encrypted = crypto.publicEncrypt(publicKeyPem, data);

    // Decrypt with private key
    const decrypted = crypto.privateDecrypt(privateKeyPem, encrypted);

    // Check if decrypted data matches original
    return decrypted.equals(data);
  } catch (e) {
    return false;
  }
}

// Example usage (PEM strings for keys)
const publicKeyPem = `-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----`;

const privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----`;

console.log('Keys match:', keysMatch(publicKeyPem, privateKeyPem));
