// Data hijacking

interface IObject {
  [key: string]: any
}

export default function observable(obj: IObject): void {
  if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") {
    throw "传入的不是对象";
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let val = obj[key];
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
          return val
        },
        set(newVal) {
          val = newVal
        }
      })
      if (Object.prototype.toString.call(val) === "[object Object]") {
        observable(val)
      }
    }
  }
}
