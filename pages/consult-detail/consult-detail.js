const app = getApp();
Page({
    data: {
        gender: 0,
        id: 0,
        info: {

        },
        name: '',
        mobile: '',
        number: '',
        introduce: ''
    },
    onLoad: function (options) {
        let id = options.id;
        this.data.id = id;
        this.getInfo();
    },
    getInfo() {
        app.http.$ajax({
            url: 'v1.consult/detail',
            data: {
                id: this.data.id
            }
        }, {
            success: (res) => {
                this.setData({
                    info: app.processImg(res.data)
                })
            }
        })
    },
    submit(e) {
        app.http.$ajax({
            url: 'v1.consult/doconsult',
            data: {
                consult_room_id: this.data.id,
                name: this.data.name,
                mobile: this.data.mobile,
                age: this.data.number,
                sex: this.data.gender,
                introduce: this.data.introduce    
            },
            loading: '申请提交中...'
        })
    },
    name(event) {
        this.setData({
            name: event.detail.value
        })
    },
    mobile(event) {
        this.setData({
            mobile: event.detail.value
        })
    },
    number(event) {
        this.setData({
            number: event.detail.value
        })
    },
    introduce(event) {
        this.setData({
            introduce: event.detail.value
        })
    },


    handleGender(e) {
        this.setData({
            gender: e.currentTarget.dataset.gender
        })
    }
})