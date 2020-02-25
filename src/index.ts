// import x from './x'
import Observable from '../packages/Observable'
import './style.css'

let obj1 = {
  name: 'wanmao'
}

Observable(obj1)

console.log(obj1.name);

obj1.name = 'oliver'

console.log(obj1.name);