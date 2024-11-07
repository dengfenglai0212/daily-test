const formattedHash = '0x57ae6cda8b0a980c4bf4086b721779183f0b29a4553db8d80ed28041cc64a42'
let hash = formattedHash;

// 检查hash长度是否小于66位(包含0x前缀)
if (formattedHash.length < 66) {
  const zerosToAdd = '0'.repeat(66 - formattedHash.length);
  hash = formattedHash.slice(0, 2) + zerosToAdd + formattedHash.slice(2);
}

console.log(hash)