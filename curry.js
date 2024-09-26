// 闭包应用：函数柯里化
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      // console.log(this)
      // return fn.apply(this, args);
      return fn(...args);
    } else {
      // return function(...moreArgs) {
      //   // return curried.apply(this, args.concat(moreArgs));
      //   return curried(...args.concat(moreArgs));
        
      // };
      return (...moreArgs) => curried(...args,...moreArgs)
    }
  };
}
 
// 使用 curry 函数的示例
function add(a, b) {
  return a + b;
}
 
const curriedAdd = curry(add);
const add5 = curriedAdd(5);
console.log(add5(3)); // 输出: 8
console.log(curriedAdd(5, 3)); // 输出: 8