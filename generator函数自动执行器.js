/**
 * generator函数自动执行器
普通的generator函数需要手工调用next()一步步执行，请用promise实现一个generator函数的自动执行器。
示例：
输入：(spawn函数即为自动执行器)
spawn(function* (){
  const a = yield 'hello';
  const b = yield ' world';
  return a + b;
});
输出：Promise {<fulfilled>: 'hello world'}
*/
function spawn(generatorFunction) {
  const generator = generatorFunction();

  function handle(result) {
      // 如果生成器已经完成，返回最终的值
      if (result.done) {
          return Promise.resolve(result.value);
      }

      // 将 yield 的值视为 Promise，并处理它
      return Promise.resolve(result.value).then(
          (res) => handle(generator.next(res)), // 将结果传递给下一个 next()
          (err) => handle(generator.throw(err))  // 处理异常
      );
  }

  // 启动生成器
  return handle(generator.next());
}

// 使用示例
spawn(function* () {
  const a = yield Promise.resolve('hello');  // 第一个 yield
  const b = yield Promise.resolve(' world'); // 第二个 yield
  return a + b;                              // 返回结果
}).then(result => {
  console.log(result); // 输出 "hello world"
}).catch(error => {
  console.error('Error:', error);
});




