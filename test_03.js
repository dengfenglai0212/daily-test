function Parent(name) {
  this.name = name;
}

Parent.prototype.greet = function() {
  console.log('Hello from ' + this.name);
};

function Child(name, age) {
  Parent.call(this, name); // 继承属性
  this.age = age;
}

Child.prototype = new Parent(); // 继承方法
Child.prototype.constructor = Child;

const child = new Child('Child', 10);
child.greet(); // 输出 "Hello from Child"
console.log(child.age); // 输出 "10"
