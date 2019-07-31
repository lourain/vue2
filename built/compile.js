define(["require", "exports", "./watcher"], function (require, exports, watcher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Compile = /** @class */ (function () {
        function Compile(el, vm) {
            this.el = typeof el == 'string' ? document.querySelector(el) : el;
            this.vm = vm;
            var fragment = this.node2fragment(this.el);
            this.el.appendChild(fragment);
        }
        Compile.prototype.node2fragment = function (node) {
            var fragment = document.createDocumentFragment();
            //compile指令插值
            this.compile(node);
            //将解析后的node添加到片段内
            this.toArray(node.childNodes).forEach(function (n) {
                fragment.appendChild(n);
            });
            return fragment;
        };
        Compile.prototype.compile = function (node) {
            var _this = this;
            // console.log(node.childNodes);
            this.toArray(node.childNodes).forEach(function (child) {
                //1=>element  3=>text
                if (child.nodeType === 1) {
                    _this.compileElement(child);
                }
                if (child.nodeType === 3) {
                    _this.compileText(child);
                }
                //如element内还有内嵌节点 则再次进行遍历 递归
                if (child.childNodes.length > 0) {
                    _this.compile(child);
                }
            });
        };
        /* 工具方法 */
        Compile.prototype.toArray = function (likeArr) {
            // return Array.from(likeArr)
            return [].slice.call(likeArr);
        };
        Compile.prototype.isDirector = function (attrName) {
            return attrName.startsWith('v-');
        };
        Compile.prototype.isEventDirector = function (attrName) {
            return attrName.split(":")[0] == 'v-on';
        };
        Compile.prototype.compileElement = function (node) {
            var _this = this;
            this.toArray(node.attributes).forEach(function (attr) {
                //attr 是一个object
                var attrName = attr.name;
                var expr = attr.value;
                if (_this.isDirector(attrName)) {
                    var type = attrName.slice(2);
                    CompileUtils[type] && CompileUtils[type](_this.vm, node, expr);
                }
                if (_this.isEventDirector(attrName)) {
                    CompileUtils['eventHandler'](_this.vm, node, attrName);
                }
            });
        };
        Compile.prototype.compileText = function (node) {
            CompileUtils.mustache(this.vm, node);
        };
        return Compile;
    }());
    exports.default = Compile;
    var CompileUtils = {
        mustache: function (vm, node) {
            var reg = /\{\{(.+)\}\}/g;
            var content = node.textContent;
            if (reg.test(content)) {
                var expr = RegExp.$1;
                node.textContent = node.textContent.replace(reg, this.getVMvalue(vm, expr));
                new watcher_1.Watcher(vm, expr, function (newVal) {
                    console.log(newVal);
                    node.textContent = newVal;
                });
            }
        },
        text: function (vm, node, expr) {
            node.textContent = this.getVMvalue(vm, expr);
            new watcher_1.Watcher(vm, expr, function (newVal) {
                node.textContent = newVal;
            });
        },
        model: function (vm, node, expr) {
            var _this = this;
            node.value = this.getVMvalue(vm, expr);
            new watcher_1.Watcher(vm, expr, function (newVal) {
                node.value = newVal;
            });
            node.addEventListener('input', function () {
                _this.setVmvalue(vm, expr, node.value);
            });
        },
        eventHandler: function (vm, node, attrName) {
            var event = attrName.split(':')[1];
            node.addEventListener(event, vm.$methods[event]);
        },
        getVMvalue: function (vm, expr) {
            var _data = vm.$data;
            expr.split('.').forEach(function (key) {
                _data = _data[key];
            });
            return _data;
        },
        setVmvalue: function (vm, expr, value) {
            var len = expr.split('.').length;
            var data = vm.$data;
            expr.split('.').forEach(function (key, index) {
                if (len - 1 == index) {
                    data[key] = value;
                }
                else {
                    data = data[key];
                }
            });
        }
    };
});
