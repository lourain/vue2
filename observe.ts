/**
 *  劫持data中的数据 */
import { Dep } from "./watcher";
 export default class Observe {
    vm: any;
    constructor(data={},vm) {
        this.vm = vm
        this.proxy(data)
    }

    walk(data) {
        if(typeof data !== 'object') return
        Object.keys(data).forEach(key=>{
            if(typeof data[key] == 'object'){
                this.walk(data[key])
            }else{
                this.defineReactive(data,key,data[key])
            }
        })
    }
    
    defineReactive(data,key,value) {
        var dep = new Dep()
        Object.defineProperty(data,key,{
            configurable:true,
            enumerable:true,
            get() {
                //compile已经调用 订阅事件
                console.log(`${key}被劫持`);
                
                Dep.target && dep.addSub(Dep.target)
                
                return value
            },
            set(newVal) {
                value = newVal
                dep.notify()
               
            }
        })    
    }

    proxy(data) {
        var dep = new Dep()
        let handler:Object = {
            get(target,key) {
                console.log(`${key}被劫持`);
                if(typeof target[key] === 'object' && target[key] != null){
                    return new Proxy(target[key],handler)
                }
                Dep.target && dep.addSub(Dep.target)
                return target[key]
            },
            set(target,key,value) {
                console.log(`${key}被设置`);
                console.log(target)
                Reflect.set(target,key,value)
                dep.notify()
                return true;//set方法应该返回一个布尔值，如果不，择在严格模式下报错。返回false时就会报错
            }
        }
       this.vm.$data = new Proxy(data,handler)
    }
}