define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //链接observe.js和compile.js
    // interface cbConfig {
    //     newVal:string | number
    //     oldValue?:string | number
    // }
    var Watcher = /** @class */ (function () {
        function Watcher(vm, expr, cb) {
            this.vm = vm;
            this.expr = expr;
            Dep.target = this;
            this.oldValue = this.getVMvalue(this.vm, this.expr);
            this.cb = cb;
        }
        Watcher.prototype.update = function () {
            var oldValue = this.oldValue;
            var newVal = this.getVMvalue(this.vm, this.expr);
            if (newVal != oldValue) {
                this.cb(newVal, oldValue);
            }
        };
        Watcher.prototype.getVMvalue = function (vm, expr) {
            var _data = vm.$data;
            expr.split('.').forEach(function (key) {
                _data = _data[key];
            });
            return _data;
        };
        return Watcher;
    }());
    exports.Watcher = Watcher;
    //建立观察者模式 方便管理
    var Dep = /** @class */ (function () {
        function Dep() {
            //订阅事件
            this.subs = [];
        }
        Dep.prototype.addSub = function (sub) {
            this.subs.push(sub);
            Dep.target = null;
        };
        Dep.prototype.notify = function () {
            this.subs.forEach(function (sub) {
                sub.update();
            });
        };
        return Dep;
    }());
    exports.Dep = Dep;
    Dep.target = undefined;
});
