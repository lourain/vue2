define(["require", "exports", "./watcher"], function (require, exports, watcher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Observe = /** @class */ (function () {
        function Observe(data, vm) {
            if (data === void 0) { data = {}; }
            this.vm = vm;
            this.proxy(data);
        }
        Observe.prototype.walk = function (data) {
            var _this = this;
            if (typeof data !== 'object')
                return;
            Object.keys(data).forEach(function (key) {
                if (typeof data[key] == 'object') {
                    _this.walk(data[key]);
                }
                else {
                    _this.defineReactive(data, key, data[key]);
                }
            });
        };
        Observe.prototype.defineReactive = function (data, key, value) {
            var dep = new watcher_1.Dep();
            Object.defineProperty(data, key, {
                configurable: true,
                enumerable: true,
                get: function () {
                    //compile已经调用 订阅事件
                    console.log(key + "\u88AB\u52AB\u6301");
                    watcher_1.Dep.target && dep.addSub(watcher_1.Dep.target);
                    return value;
                },
                set: function (newVal) {
                    value = newVal;
                    dep.notify();
                }
            });
        };
        Observe.prototype.proxy = function (data) {
            var dep = new watcher_1.Dep();
            var handler = {
                get: function (target, key) {
                    console.log(key + "\u88AB\u52AB\u6301");
                    if (typeof target[key] === 'object' && target[key] != null) {
                        return new Proxy(target[key], handler);
                    }
                    watcher_1.Dep.target && dep.addSub(watcher_1.Dep.target);
                    return target[key];
                },
                set: function (target, key, value) {
                    console.log(key + "\u88AB\u8BBE\u7F6E");
                    console.log(target);
                    Reflect.set(target, key, value);
                    dep.notify();
                    return true; //set方法应该返回一个布尔值，如果不，择在严格模式下报错。返回false时就会报错
                }
            };
            this.vm.$data = new Proxy(data, handler);
        };
        return Observe;
    }());
    exports.default = Observe;
});
