class MyPromise{
  constructor(executor) {
    this.status = 'pending'
    this.value = null
    this.resolveArr = []
    this.rejectArr = []

    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
        this.resolveArr.forEach(fn => fn())
      }
    }
    const reject = (value) => {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.value = value
        this.rejectArr.forEach(fn => fn())
      }
    }

    try {
      executor(resolve,reject)
    } catch (error) {
      reject(error)
    }

  }

  then(onResolve,onReject) {
    return new MyPromise((resolve, reject) => {
      onResolve = typeof onResolve === 'function' ? onResolve : value => value
      onReject = typeof onReject === 'function' ? onReject : value => value
      const handleResolve = () => {
        try {
          setTimeout(() => {
            const res = onResolve(this.value)
            resolve(res)
          })
        } catch (error) {
          reject(error)
        }
      }
      const handleRejected = () => {
        try {
          setTimeout(() => {
            const res = onReject(this.value)
            resolve(res)
          })
        } catch (error) {
          reject(error)
        }
      }
      if (this.status === 'fulfilled') {
        handleResolve()
      }
      if (this.status === 'rejected') {
        handleRejected()
      }
      else {
        this.resolveArr.push(() => {
          setTimeout(() => {
            try {
              handleResolve()
            } catch (error) {
              reject(error)
            }
          })
        })
        this.rejectArr.push(() => {
          setTimeout(() => {
            try {
              handleRejected()
            } catch (error) {
              reject(error)
            }
          })
        })
      }
    })
  }
  catch(onReject) {
    return this.then(null,onReject)
  }
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        MyPromise.resolve(promise).then(resolve).catch(reject)
      })
    })
  }
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let count = 0
      let res = []
      promises.forEach((promise,index) => {
        MyPromise.resolve(promise).then(val => {
          count++
          res[index] = val
          if (count === promises.length) {
            resolve(res)
          }
        }).catch(e=>reject(e))
      })
    })

  }

  static resolve(value) {
    return new MyPromise((resolve) => resolve(value))
  }
  static reject(value) {
    return new MyPromise((_, reject) => reject(value))
  }
}

const promise1 = new MyPromise((resolve, reject) => {
  resolve('1')
})
const promise2 = new MyPromise((resolve,reject) => {
  resolve('2')
})

// promise1.then(res => {
//   console.log(res)
//   return '222'
// }).then(res => {
//   console.log(res)
// }).catch(e => {
//   console.log('e',e)
// })
MyPromise.all([promise1, promise2]).
  then(res => console.log('res',res)).
  catch(e => console.log('e',e))