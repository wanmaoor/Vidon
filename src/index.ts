import Reactive from '../packages/Reactive'
import { Subject, Observe} from '../packages/Observe'
import './style.css'

let obj1 = {
  name: 'wanmao'
}

Reactive(obj1)

console.log(obj1.name);

obj1.name = 'oliver'


console.log(obj1.name);
let subject = new Subject()
let observer = new Observe()
observer.update = function () {
  console.log('observer update')
}
observer.subscribeTo(subject)  //观察者订阅主题

subject.notify()