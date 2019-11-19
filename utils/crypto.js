var cryptoJS = require('./crypto-js.js');

function md5(plaintext)
{
  return cryptoJS.MD5(plaintext).toString();
}

function sha1(plaintext)
{
  return cryptoJS.SHA1(plaintext).toString();
}

function sha256(plaintext)
{
  return cryptoJS.SHA256(plaintext).toString();
}

function sha512(plaintext)
{
  return cryptoJS.SHA512(plaintext).toString();
}

function sha3(plaintext, length)
{
  return cryptoJS.SHA3(plaintext, { outputLength: length}).toString();
}

function ripemd160(plaintext)
{
  return cryptoJS.RIPEMD160(plaintext).toString();
}

function encrypt(plaintext, algorithm, key, mode = cryptoJS.mode.CBC, padding = cryptoJS.pad.Pkcs7)
{
  // 对向量和key进行128位编码
  key = cryptoJS.enc.Utf8.parse(key);
  var iv = cryptoJS.enc.Utf8.parse(md5(key).substr(0, 16));

  // 加密参数
  var param = {
    iv: iv,
    mode: mode,
    padding: padding
  };

  // 对JSON字符串进行加密处理
  return algorithm.encrypt(plaintext, key, param).toString();
}

function decrypt(ciphertext, algorithm, key, mode = cryptoJS.mode.CBC, padding = cryptoJS.pad.Pkcs7) 
{
  // 对向量和key进行128位编码
  key = cryptoJS.enc.Utf8.parse(key);
  var iv = cryptoJS.enc.Utf8.parse(md5(key).substr(0, 16));

  // 加密参数
  var param = {
    iv: iv,
    mode: mode,
    padding: padding
  };

  // 对JSON字符串进行加密处理
  return algorithm.decrypt(ciphertext, key, param).toString(cryptoJS.enc.Utf8);
}


module.exports = {
  md5: md5,
  sha1: sha1,
  sha256: sha256,
  sha512: sha512,
  sha3: sha3,
  ripemd160: ripemd160,
  encrypt: encrypt,
  decrypt: decrypt,
  SHA512: 512,
  SHA384: 384,
  SHA256: 256,
  SHA224: 224,
  AES: cryptoJS.AES,
  DES: cryptoJS.DES,
  TripleDES: cryptoJS.TripleDES,
  Rabbit: cryptoJS.Rabbit,
  RC4: cryptoJS.RC4,
  RC4Drop: cryptoJS.RC4Drop,
  CBC: cryptoJS.mode.CBC,
  CFB: cryptoJS.mode.CFB,
  CTR: cryptoJS.mode.CTR,
  OFB: cryptoJS.mode.OFB,
  ECB: cryptoJS.mode.ECB,
  Pkcs7: cryptoJS.pad.Pkcs7,
  Iso97971: cryptoJS.pad.Iso97971,
  AnsiX923: cryptoJS.pad.AnsiX923,
  Iso10126: cryptoJS.pad.Iso10126,
  ZeroPadding: cryptoJS.pad.ZeroPadding,
  NoPadding: cryptoJS.pad.NoPadding
}