const app = getApp();
Page({

    data: {
        tabIdx: 0,
        teacher: false,
        cate: [],
        loading: false,
        tip: '上拉加载',
        page: 1,
        cur_list: [],
        is_pull : true,
        id: 0,
        tuijian: {},
        temp: {} //临时推荐
    },

    onLoad(e) {
        let that = this;
        wx.getSystemInfo({
            success: (res) => {
                that.setData({
                    deviceHeight: res.windowHeight
                });
            }
        });
        wx.setNavigationBarTitle({
          title: e.title ? e.title : '课程'
        });  
        if (e.type == 'teacher') {
            this.setData({
                teacher: true
            })
        
            //加载老师列表
            this.getTeacher((res) => {
                //第一次加载id为0
                this.getTeacherCourse(0);
            });
        } else {
            this.setData({
                teacher: false
            })
            //加载专题数据
            this.getCate((res) => {
                //第一次加载id为0
                this.getSpecial(0);
            });
        }
    },
    //获取专题分类
    getCate(fn=null) {
        let that = this;
        app.http.$ajax({
            url: 'v1.learn/learnCateSpecial',
            loading: false
        }, {
            success(res) {
                that.setData({
                    cate: res.data
                });
                if (fn !== null && app.util.isFunction(fn)) {
                    fn(res.data);
                }
            }
        });
    },
    //获取专题列表
    getSpecial(special_id) {
        //如果 is_pull = false代表不能继续上拉加载
        if(!this.data.is_pull) {
            return;
        }
        let that = this;
        this.setData({
            loading: true,
            tip: '正在加载',
        });
        app.http.$ajax({
            url: 'v1.learn/learnCateSpecialCourse',
            data: {
                special_id: special_id,
                page: that.data.page
            },
            loading: false
        }, {
            success(res) {
                that.data.cur_list.push(...res.data.data)
                that.setData({
                    cur_list: app.processImg(that.data.cur_list)
                });
                that.data.page++;
            },
            complete(res) {
                let tip = '';
                if (app.util.isString(res)) {
                    app.info(res);
                    tip = '上拉加载';
                } else if (!app.util.isUndefined(res.data) && app.util.isArray(res.data.data)) {
                    if (res.data.data.length < 15) {
                        that.data.is_pull = false;
                        tip = '没有更多课程'     
                    } else {
                        tip = '上拉加载';
                    }
                }
                that.setData({
                    loading: false,
                    tip: tip,
                })   
            }
        });
    },
    getTeacher(fn) {
        let that = this;
        app.http.$ajax({
            url: 'v1.learn/getTeachers',
            loading: false
        }, {
            success(res) {
                that.setData({
                    cate: res.data.list,
                    tuijian: app.processImg(res.data.tuijian),
                    temp: app.processImg(res.data.tuijian)
                });
                if (fn !== null && app.util.isFunction(fn)) {
                    fn(res.data);
                }
            }
        });
    },
    getTeacherCourse(teacher_id) {
        //如果 is_pull = false代表不能继续上拉加载
        if (!this.data.is_pull) {
            return;
        }
        let that = this;
        this.setData({
            loading: true,
            tip: '正在加载',
        });
        app.http.$ajax({
            url: 'v1.learn/getTeachersCourse',
            data: {
                teacher_id: teacher_id,
                page: that.data.page
            },
            loading: false
        }, {
                success(res) {
                    that.data.cur_list.push(...res.data.data)
                    that.setData({
                        cur_list: app.processImg(that.data.cur_list)
                    });
                    that.data.page++;
                },
                complete(res) {

                    let tip = '';
                    if (app.util.isString(res)) {
                        app.info(res);
                        tip = '上拉加载';
                    } else if (!app.util.isUndefined(res.data) && app.util.isArray(res.data.data)) {
                        if (res.data.data.length < 15) {
                            that.data.is_pull = false;
                            tip = '没有更多课程'
                        } else {
                            tip = '上拉加载';
                        }
                    }
                    that.setData({
                        loading: false,
                        tip: tip,
                    })
                }
            });
    },
    //变化tab 请求不同的方法
    handleTab(e) {
        let idx = e.currentTarget.dataset.idx;
        if (this.data.tabIdx == idx) {
            return;
        }
        //切换tab 清空当前tab
        this.setData({
            tabIdx: idx,
            cur_list: []
        })

        //初始化
        this.data.page = 1;
        this.data.is_pull = true;
        this.data.id = e.currentTarget.dataset.id;
        if (this.data.teacher) {
            //设置推荐人
            if(idx == 0) {
                this.setData({
                  tuijian: app.processImg(this.data.temp)
                })
            } else {
                let temp = this.data.cate[idx];
                this.setData({
                  tuijian: app.processImg(temp)
                })
            }

            //请求数据
            this.getTeacherCourse(this.data.id);
        } else {
            //专题分发 获取当前专题special_id
            this.getSpecial(this.data.id);
        }
    },
    getMore: function () {
        if (this.data.is_pull === true) {
            if (this.data.teacher) {

            } else {
                //专题分发 获取当前专题special_id
                this.getSpecial(this.data.id);
            }
        }
    },
    open(e) {
        let course_id = e.currentTarget.dataset.course_id;
        wx.navigateTo({
            url: '/pages/lesson-detail/lesson-detail?course_id=' + course_id,
        })
    },

    handleTeacher(e) {
        let id = e.currentTarget.dataset.id;
    
        wx.navigateTo({
            url: '/pages/teacher/teacher?teacher_id=' + id,
        })
    }
})