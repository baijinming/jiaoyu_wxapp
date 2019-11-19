Component({
  properties: {
    auth: {
      //标题
      type: Number,
      value: 3,   //为主持人 2 为主讲人 3为观众
    },
    listeners: {
      type: Array,
      value: []
    }
  },
  data: {
    checked: true
  },
  ready: function() {
    console.log(this.data.auth)
  },
  methods: {
    onChange(e) {
      this.setData({
        checked: !this.data.checked
      })
    }
  }
});
