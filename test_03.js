// let tua=(zzh)=>{
//     return zzh+=20
// }
// let zzh =250
// let xiang =tua(zzh)
// console.log(zzh)
// console.log(xiang)

// let setFengtuo = (zzh) =>{
//     zzh.fengtuo = 'sb'
// }

// let aSb =new Object()
// setFengtuo(aSb)
// console.log(aSb)

// let setFengtuo = (zzh) =>{
//     zzh.fengtuo = 'sb'
//     zzh = new Object()
//     zzh.fengtuo = 'nb'
//     x = null
// }

// let aSb =new Object()
// setFengtuo(aSb)
// console.log(aSb)

let obj ={
  name:1,
  age:2
}
console.log(obj)
// for(var key in obj){
//   console.log(key);
//   obj[key] = null
// }
console.log(Object.keys(obj))
Object.keys(obj).forEach(key=>{obj[key]=''})
console.log(obj)