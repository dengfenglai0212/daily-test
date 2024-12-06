const crypto = require("crypto");

function toUQAddress(standardAddress) {
  const [workchain, hexAddress] = standardAddress.split(":");
  const workchainByte = parseInt(workchain); // 转换工作链号为字节
  const addressBuffer = Buffer.from(hexAddress, "hex");

  // 拼接工作链号和地址
  const fullAddress = Buffer.concat([
    Buffer.from([workchainByte]),
    addressBuffer
  ]);

  // 计算校验和 (CRC-16)
  const crc16 = (buffer) => {
    let crc = 0xffff;
    for (let byte of buffer) {
      crc ^= byte;
      for (let i = 0; i < 8; i++) {
        if (crc & 1) {
          crc = (crc >> 1) ^ 0x1021;
        } else {
          crc >>= 1;
        }
      }
    }
    return crc & 0xffff;
  };

  const checksum = crc16(fullAddress);

  // 将地址与校验和编码为 Base64
  const base64Address = Buffer.concat([
    fullAddress,
    Buffer.from([(checksum >> 8) & 0xff, checksum & 0xff]) // 校验和的高位和低位
  ]).toString("base64");

  return `UQ-${base64Address}`;
}

// 示例地址转换
const standardAddress = "0:4c6fe61a4b7925532dee47deed8367fb9e918d4b32a9b9ec270bef9d9c65ca13"
console.log(toUQAddress(standardAddress));