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
        console.log(`get ${key}: ${val}`);
        if (currentObserver) {
          console.log("has currentObserver");
          currentObserver.subscribeTo(subject);
        }
        return val;
      },
      set: function(newVal) {
        val = newVal;
        console.log("start notify...");
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
      console.log("subscribeTo.. ", subject);
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

export default class Vidon {
  constructor(opts) {
    this.init(opts);
    Reactive(this.$data);
    this.compile();
  }
  init(opts) {
    this.$el = document.querySelector(opts.el);
    this.$data = opts.data;
    this.observers = [];
  }
  compile() {
    this.traverse(this.$el);
  }
  traverse(node) {
    if (node.nodeType === 1) {
      node.childNodes.forEach(childNode => {
        this.traverse(childNode);
      });
    } else if (node.nodeType === 3) {
      //文本
      this.renderText(node);
    }
  }
  renderText(node) {
    let reg = /{{(.+?)}}/g;
    let match;
    while ((match = reg.exec(node.nodeValue))) {
    console.log("TCL: Vidon -> renderText -> match", match)
      
      let raw = match[0];
      let key = match[1].trim();
      node.nodeValue = node.nodeValue.replace(raw, this.$data[key]);
      new Observer(this, key, function(val, oldVal) {
        node.nodeValue = node.nodeValue.replace(oldVal, val);
      });
    }
  }
}
