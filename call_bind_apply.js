
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation);
  // console.log(this); // 打印当前的 this，即 context 对象 person
}
const person = {
  name:'shuai'
}

Function.prototype.myCall = function(context,...args){
  context = context || window
  let mySymbol = Symbol('fn')
  context[mySymbol] = this
  let res= context[mySymbol](...args)
  delete context[mySymbol]
  return res
}

Function.prototype.myBind = function (context, ...args) {
  const self = this
  return function (...moreArgs) {
    return self.myCall(context,...args,...moreArgs)
  }
}
greet.myBind(person)('hello','?')