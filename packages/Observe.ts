
class Subject {
  observers: any[];
  constructor() {
    this.observers = [];
  }
  addObserve(observe: Observe) { 
    this.observers.push(observe)
  }
  removeObserve(observe: Observe) { 
    const index = this.observers.indexOf(observe)
    if (index > -1) { 
      this.observers.splice(index, 1)
    }
  }
  notify() { 
    this.observers.forEach(observe => { 
      observe.update()
    })
  }
}

class Observe { 
  update: Function
  constructor() {
    this.update = function () { }
  }
  subscribeTo(subject: Subject) {
    subject.addObserve(this)
  }
}

export {Subject, Observe}