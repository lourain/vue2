new Proxy({}, {
    get(target,key) { 
        Reflect.get(target,key)
    }
})

