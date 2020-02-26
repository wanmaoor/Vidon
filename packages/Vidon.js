import IDGenerator from "./IDGenerator";
function Reactive(data) {
  if (!data || typeof data !== "object") return;
  for (var key in data) {
    let val = data[key];
    let subject = new Subject();
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        // console.log(`get ${key}: ${val}`);
        if (currentObserver) {
          // console.log("has currentObserver");
          currentObserver.subscribeTo(subject);
        }
        return val;
      },
      set: function(newVal) {
        val = newVal;
        // console.log("start notify...")
        subject.notify();
      }
    });
    if (typeof val === "object") {
      Reactive(val);
    }
  }
}

let currentObserver = null;

class Subject {
  constructor() {
    this.id = IDGenerator();
    this.observers = [];
  }
  addObserver(observer) {
    this.observers.push(observer);
  }
  removeObserver(observer) {
    var index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }
  notify() {
    this.observers.forEach(observer => {
      observer.update();
    });
  }
}

class Observer {
  constructor(vm, key, cb) {
    this.subjects = {};
    this.vm = vm;
    this.key = key;
    this.cb = cb;
    this.value = this.getValue();
  }
  update() {
    let oldVal = this.value;
    let value = this.getValue();
    if (value !== oldVal) {
      this.value = value;
      this.cb.bind(this.vm)(value, oldVal);
    }
  }
  subscribeTo(subject) {
    if (!this.subjects[subject.id]) {
      // console.log("subscribeTo.. ", subject);
      subject.addObserver(this);
      this.subjects[subject.id] = subject;
    }
  }
  getValue() {
    currentObserver = this;
    let value = this.vm.$data[this.key];
    currentObserver = null;
    return value;
  }
}

class Compile {
  compile() {
    // throw new Error("Method not implemented.");
    this.traverse(this.node);
  }
  traverse(node) {
    // throw new Error("Method not implemented.");
    if (node.nodeType === 1) {
      this.compileNode(node);
      node.childNodes.forEach(childNode => {
        this.traverse(childNode);
      });
    } else if (node.nodeType === 3) {
      //文本
      this.compileText(node);
    }
  }
  compileNode(node) {
    // throw new Error("Method not implemented.");
    let attrs = [...node.attributes];
    console.log("TCL: Compile -> compileNode -> attrs", attrs);
    attrs.forEach(attr => {
      if (this.isModelDirective(attr.name)) {
        let key = attr.value;
        node.value = this.vm.$data[key];
        new Observer(this.vm, key, function (newVal) {
          node.value = newVal;
        });
        node.oninput = e => {
          this.vm.$data[key] = e.target.value;
        };
      } else if (this.isEventDirective(attr.name)) {
        let eventType = attr.name.substr(1)
        let methodName = attr.value
        node.addEventListener(eventType, this.vm.$methods[methodName])
       }
    });
  }
  isEventDirective(name) {
    // throw new Error("Method not implemented.");
    return name.indexOf('@') === 0
  }
  isModelDirective(name) {
    return name === "v-model";
  }
  compileText(node) {
    console.log("TCL: Compile -> compileText -> node", node);
    // throw new Error("Method not implemented.");
    let reg = /{{(.+?)}}/g;
    let match;
    while ((match = reg.exec(node.nodeValue))) {
      let raw = match[0];
      let key = match[1].trim();
      node.nodeValue = node.nodeValue.replace(raw, this.vm.$data[key]);
      new Observer(this.vm, key, function(val, oldVal) {
        node.nodeValue = node.nodeValue.replace(oldVal, val);
      });
    }
  }
  constructor(vm) {
    this.vm = vm;
    this.node = vm.$el;
    this.compile();
  }
}

export default class Vidon {
  constructor(opts) {
    this.init(opts);
    Reactive(this.$data);
    new Compile(this);
  }
  init(opts) {
    this.$el = document.querySelector(opts.el);
    this.$data = opts.data;
    this.$methods = opts.methods

    for (const key in this.$data) {
      if (this.$data.hasOwnProperty(key)) {
        Object.defineProperty(this, key, {
          enumerable: true,
          configurable: true,
          get: () => { 
            return this.$data[key]
          },
          set: newVal => {
            this.$data[key] = newVal
          }
        })
      }
    }

    for (const key in this.$methods) {
      if (this.$methods.hasOwnProperty(key)) {
        Object.defineProperty(this, key, {
          enumerable: true,
          configurable: true,
          get: () => { 
            return this.$methods[key]
          },
          set: (fn) => { 
            this.$methods[key] = fn
          }
        })
        this.$methods[key] = this.$methods[key].bind(this)
      }
    }
  }
}
