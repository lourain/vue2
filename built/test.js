new Proxy({}, {
    get: function (target, key) {
        Reflect.get(target, key);
    }
});
