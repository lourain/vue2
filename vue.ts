import Observe from "./observe";
import Compile from "./compile";
export default class Vue {
    $el: Element;
    $data: object;
    $methods: any;
    constructor(options) {
        this.$el = options.el
        this.$data = options.data
        this.$methods = options.methods
        new Observe(this.$data, this)
        this.proxy(this.$data)

        if (this.$el) {
            new Compile(this.$el, this)
        }
    }
    proxy(obj: object): void {
        Object.keys(obj).forEach(key => {
            //在vm在定义key的属性
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                get() {
                    // this[key] = obj[key]
                    return obj[key]
                },
                set(newValue) {
                    // obj[key] = newValuerrr
                    Reflect.set(obj, key, newValue)
                }
            })
        })
    }

}


