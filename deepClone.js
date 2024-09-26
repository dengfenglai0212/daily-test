function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (map.has(obj)) return map.get(obj);

  const clone = Array.isArray(obj) ? [] : {};
  map.set(obj, clone);

  Object.keys(obj).forEach(key => {
    // console.log(key)
    clone[key] = deepClone(obj[key], map);
  });

  return clone;
}
const source = { a: 1, b: { c: 2 } };
Object.keys(source).forEach((key) => {
  console.log('....',key)
})
// source.d = source
const deepCopy = deepClone(source);

deepCopy.b.c = 3;
console.log(source.b.c); // 输出: 2，源对象未被影响