import {Watcher} from './watcher'
export default class Compile {
    vm: object;
    el:HTMLElement;
    constructor(el, vm) {
        this.el = typeof el == 'string' ? document.querySelector(el) : el
        this.vm = vm

        let fragment = this.node2fragment(this.el)

        this.el.appendChild(fragment)

    }

    node2fragment(node) {
        let fragment = document.createDocumentFragment()
        //compile指令插值
        this.compile(node)
        //将解析后的node添加到片段内
        this.toArray(node.childNodes).forEach(n=>{
            fragment.appendChild(n)
        })
        return fragment
    }

    compile(node) {
        // console.log(node.childNodes);
        this.toArray(node.childNodes).forEach(child => {
            //1=>element  3=>text
            if (child.nodeType === 1) {
                this.compileElement(child)
                
            }
            if (child.nodeType === 3) {
                this.compileText(child)
            }
            //如element内还有内嵌节点 则再次进行遍历 递归
            if (child.childNodes.length > 0) {
                this.compile(child)
            }

        })
    }

    /* 工具方法 */
    toArray(likeArr) {
        // return Array.from(likeArr)
        return [].slice.call(likeArr)
    }
    isDirector(attrName) {
        return attrName.startsWith('v-')
    }
    isEventDirector(attrName) {
        return attrName.split(":")[0] == 'v-on'
    }

    compileElement(node) {
        this.toArray(node.attributes).forEach(attr => {
            //attr 是一个object
            let attrName = attr.name
            let expr = attr.value

            if (this.isDirector(attrName)) {
                let type = attrName.slice(2)
                CompileUtils[type] && CompileUtils[type](this.vm, node, expr)
            }
            if (this.isEventDirector(attrName)) {
                CompileUtils['eventHandler'](this.vm, node, attrName)
            }

        })
    }

    compileText(node) {
        CompileUtils.mustache(this.vm, node)
    }
}

let CompileUtils = {
    mustache(vm, node) {
        let reg = /\{\{(.+)\}\}/g
        let content = node.textContent
        
        
        if (reg.test(content)) {
            let expr = RegExp.$1
            node.textContent = node.textContent.replace(reg, this.getVMvalue(vm, expr))
            new Watcher(vm, expr, (newVal: any)=>{
                console.log(newVal);
                node.textContent = newVal
            })
        }

    },
    text(vm, node, expr) {
        node.textContent = this.getVMvalue(vm, expr)
        new Watcher(vm, expr, (newVal) => {
            node.textContent = newVal
        })
    },
    model(vm, node, expr) {
        node.value = this.getVMvalue(vm, expr)
        new Watcher(vm,expr,newVal=>{
            node.value = newVal
        })
        node.addEventListener('input',()=>{
            this.setVmvalue(vm,expr,node.value)
            
        })
    },
    eventHandler(vm, node, attrName) {
        let event = attrName.split(':')[1]
        node.addEventListener(event, vm.$methods[event])
    },
    getVMvalue(vm, expr) {
        let _data = vm.$data
        expr.split('.').forEach(key => {
            _data = _data[key]
        })
        return _data
    },
    setVmvalue(vm,expr,value) {
        let len = expr.split('.').length
        let data = vm.$data
        expr.split('.').forEach((key,index)=>{
            if(len-1 == index){
                data[key] = value
            }else{
                data = data[key]
            }
        })  
    }
}