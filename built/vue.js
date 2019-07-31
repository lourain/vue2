define(["require", "exports", "./observe", "./compile"], function (require, exports, observe_1, compile_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Vue = /** @class */ (function () {
        function Vue(options) {
            this.$el = options.el;
            this.$data = options.data;
            this.$methods = options.methods;
            new observe_1.default(this.$data, this);
            this.proxy(this.$data);
            if (this.$el) {
                new compile_1.default(this.$el, this);
            }
        }
        Vue.prototype.proxy = function (obj) {
            var _this = this;
            Object.keys(obj).forEach(function (key) {
                //在vm在定义key的属性
                Object.defineProperty(_this, key, {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        // this[key] = obj[key]
                        return obj[key];
                    },
                    set: function (newValue) {
                        // obj[key] = newValuerrr
                        Reflect.set(obj, key, newValue);
                    }
                });
            });
        };
        return Vue;
    }());
    exports.default = Vue;
});
