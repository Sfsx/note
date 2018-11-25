/**
 * https://promisesaplus.com/
 * Promises/A+
 * Realizing my promise according to Promises/A+
 */
'use strict';

function promise(executor) {
  const self = this
  self.status = 'pending'
  self.data = undefined
  self.onResolvedCallback = []
  self.onRejectedCallback = []

  function resolve(value) {
    setTimeout(function () {
      if (self.status === 'pending') {
        self.status = 'resolved'
        self.data = value
        for (var i = 0; i < self.onResolvedCallback.length; i++) {
          self.onResolvedCallback[i](value)
        }
      }
    })
  }

  function reject(reason) {
    setTimeout(function () {
      if (self.status === 'pending') {
        self.status = 'rejected'
        self.data = reason
        for (var i = 0; i < self.onRejectedCallback.length; i++) {
          self.onRejectedCallback[i](reason)
        }
      }
    })
  }
  try {
    executor(resolve, reject) // 执行executor
  } catch (e) {
    reject(e)
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  let noFirst = false
  let then

  if (x === promise2) {
    return reject(new TypeError())
  }

  if (x instanceof promise) {
    if (x.status === 'pending') { //because x could resolved by a Promise Object
      x.then(function (v) {
        resolvePromise(promise2, v, resolve, reject)
      }, reject)
    } else { //but if it is resolved, it will never resolved by a Promise Object but a static value;
      x.then(resolve, reject)
    }
    return
  }

  if ((x !== null) && ((IS_FUNCTION(x)) || (typeof x === 'object'))) {
    try {
      then = x.then
      if (typeof then === 'function') {
        try {
          then.call(x,
            (y) => {
              if (noFirst) { return }
              noFirst = true
              return resolvePromise(promise2, y, resolve, reject)
            },
            (r) => {
              if (noFirst) { return }
              noFirst = true
              reject(r)
            }
          )
        } catch (e) {
          if (noFirst) { return }
          noFirst = true
          reject(e)
        }
      } else {
        resolve(x)
      }
    } catch (e) {
      reject(e)
    }
  } else {
    resolve(x)
  }
}
/**
 * 判断是否是函数
 * @param {object} obj
 * @returns {boolean}  
 */
function IS_FUNCTION(obj) {
  return typeof obj === 'function'
}

promise.prototype.then = function (onResolved, onRejected) {
  var self = this
  var promise2
  // 根据标准，如果then的参数不是function，则我们需要忽略它，此处以如下方式处理
  onResolved = IS_FUNCTION(onResolved) ? onResolved : function(v) {
    return v
  }
  onRejected = IS_FUNCTION(onRejected) ? onRejected : function(r) {
    throw r
  }

  if (self.status === 'resolved') {
    return promise2 = new promise(function (resolve, reject) {
      setTimeout(function () { // 异步执行onResolved
        try {
          var x = onResolved(self.data)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  if (self.status === 'rejected') {
    return promise2 = new promise(function (resolve, reject) {
      setTimeout(function () { // 异步执行onResolved
        try {
          var x = onRejected(self.data)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    })
  }
  
  if (self.status === 'pending') {
    return promise2 = new promise(function (resolve, reject) {
      self.onResolvedCallback.push((value) => {
        try {
          var x = onResolved(value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
      self.onRejectedCallback.push((reason) => {
        try {
          var x = onRejected(reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    })
  }
}

promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

promise.deferred = promise.defer = function () {
  let dfd = {}
  dfd.promise = new promise(function (resolve, reject) {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}
module.exports = promise
