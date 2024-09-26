const proxy = new Proxy(function(x, y) {
    return x + y;
  }, {
    apply(target, thisArg, argumentsList) {
    console.log(target,thisArg,argumentsList)
      return target(...argumentsList) * 2;
    }
  });
  console.log(proxy(2, 3)); // 输出 10，而不是 5