require.config({
    "paths":{
        "compile":"./compile",
        "watcher":"./watcher",
        "observe":"./observe",
        "vue":"./vue",
    }
})
require(["vue"],function(Vue){
    Vue = Vue['default']
    console.log(Vue);
    var vm = new Vue({
        el: '#app',
        data: {
            msg: 'hello world',
            name: '李逸威',
            time: '20190617',
            list: [1, 2, 3],
            car: {
                brand: '大众',
                color: 'yellow',
                owner: {
                    ownerName: "lyw"
                }
            }
        },
        methods: {
            clickFn() {

                this.car.owner.ownerName = 'baibai'
            }
        },
    })
            
})