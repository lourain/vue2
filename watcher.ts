//链接observe.js和compile.js
// interface cbConfig {
//     newVal:string | number
//     oldValue?:string | number
// }
export class Watcher {
    vm:any
    expr:string
    oldValue: any;
    cb: (newVal,oldValue)=>void;
    constructor(vm: any,expr: string,cb:any) {
        this.vm = vm
        this.expr = expr
        
        Dep.target = this
        this.oldValue = this.getVMvalue(this.vm,this.expr)
        
        this.cb = cb
    }
    update() {
        let oldValue:string = this.oldValue
        let newVal:string = this.getVMvalue(this.vm,this.expr)
        if(newVal != oldValue){
            this.cb(newVal,oldValue)
        }
    }
    getVMvalue(vm: any,expr: string) {
        let _data = vm.$data
        
        expr.split('.').forEach((key: string | number)=>{
            _data = _data[key]
        })
        return _data
    }
} 


//建立观察者模式 方便管理
export class Dep {
    // target: this;
    subs: any[];
    static target: any;
    constructor() {
        //订阅事件
        this.subs = []
    }
    addSub(sub: any) {
        this.subs.push(sub)
        Dep.target = null
    }
    notify() {
        this.subs.forEach((sub: { update: () => void; })=>{
            sub.update()
        })
    }
}

Dep.target = undefined;
