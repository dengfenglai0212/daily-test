/**
 * 测试可选链
 */

const testObj = {
    name:'testObj',
    subObj:{
        name:'subObj',
        bigObj:{
            name:'bigObj',
            smallObj:{
                name:'smallObj'
            }
        }
    }
}

console.log(testObj?.subObj?.bigObj?.smallObj?.name)
console.log(testObj?.subObj?.bigObjj?.smallObj?.name)
// console.log(testObj?.subObj?.bigObjj.smallObj?.name)
console.log(null == undefined)
console.log(null === undefined)
console.log(typeof null)
console.log(typeof undefined)