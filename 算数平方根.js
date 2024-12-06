// 实现一个函数, 完成 开根号 的操作, 方法签名如下：

// double sqrt(int v, double t)
// 要求:

// 不能调用系统库函数, 诸如 Math.sqrt(v) 之类的;

function sqrt(v, t) {
  if (v < 0) {
    return -1
  }
  if (v === 0) {
    return 0
  }
  let start = 0
  let end = v
  let cur = (start + end) / 2
  while (Math.abs(cur * cur - v) > t) {
    if (cur * cur > v) {
      end = cur
    } else {
      start = cur
    }
    cur = (start + end) / 2
  }
  return cur
}

console.log(sqrt(10, 0.0001))
console.log(sqrt(10, 0.0001) * sqrt(10, 0.0001))