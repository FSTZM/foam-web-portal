<template>
    <div class="dashboard">
        <div>
            <el-card class="Breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/admin/system/dashboard' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>仪表盘</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </div>
        <div>
            <el-row type="flex" justify="center" >
                <el-col :span="5">
                    <el-card class="box-card" shadow="hover">
                        <div class="title">
                            <span>文章</span>
                            <span class=" icon"><a href="#" class="el-icon-link" @click.prevent="toNextPage('posts/list')"></a></span>
                        </div>
                        <div class="text" v-text="message.postNum">
                            0
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="5">
                    <el-card class="box-card" shadow="hover">
                        <div class="title">
                            <span>评论</span>
                            <span class=" icon"><a href="#" class="el-icon-link" @click.prevent="toNextPage('comment')"></a></span>
                        </div>
                        <div class="text" v-text="message.commentCount">
                            0
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="5">
                    <el-card class="box-card" shadow="hover">
                        <div class="title">
                            <span>总访问</span>
                            <el-tooltip class="item" effect="dark" :content="'文章总访问共'+message.totalAccessNum+'次'" placement="top-start">
                                <i class="el-icon-warning-outline" style="float: right"></i>
                            </el-tooltip>
                        </div>
                        <div class="text" v-text="message.totalAccessNum">
                            0
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="5">
                    <el-card class="box-card" shadow="hover">
                        <div class="title">
                            <span>建立天数</span>
                            <el-tooltip class="item" effect="dark" :content="'博客建立于'+message.createdDate" placement="top-start">
                                <i class="el-icon-warning-outline" style="float: right"></i>
                            </el-tooltip>
                        </div>
                        <div class="text" v-text="days">
                            0
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-row type="flex" justify="start" :gutter="20">
                <el-col :span="7">
                    <el-card class="box-card2" shadow="hover" body-style="padding-top:0px,padding-bottom=0px">
                        <div slot="header" class="clearfix">
                            <span>新动态</span>
                        </div>
                        <el-tabs value="first" class="tabs1" :stretch="true" style="margin-top: -20px;">
                            <el-tab-pane label="最近文章" name="first" style="margin-top: -25px">
                                <div v-for="post in record.postList">
                                    <div>
                                        <el-divider></el-divider>
                                        <a v-text="post.title" class="post" href="#" @click.prevent="showPost(post.id)"></a><i v-text="getDateDiff(post.time)" style="float: right"></i>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="最近评论" name="second" style="margin-top: -25px">
                                <div v-for="comment in record.commentList">
                                    <div v-if="comment.postTitleVo.id == -1">
                                        <el-divider></el-divider>
                                        <i v-text="comment.nick" style="color: #0F9FB4"></i><i>&nbsp;在《</i><a v-text="comment.postTitleVo.title" class="post" href="#" @click.prevent="toNextPageAbout"></a><i>》中评论:</i><i v-text="getDateDiff(comment.insertedAt)" style="float: right"></i>
                                        <div v-html="comment.comment" style="margin-top: 1em"></div>
                                    </div>
                                    <div v-else>
                                        <el-divider></el-divider>
                                        <i v-text="comment.nick" style="color: #0F9FB4"></i><i>&nbsp;在《</i><a v-text="comment.postTitleVo.title" class="post" href="#" @click.prevent="showPost(comment.postTitleVo.id)"></a><i>》中评论:</i><i v-text="getDateDiff(comment.insertedAt)" style="float: right"></i>
                                        <div v-html="comment.comment" style="margin-top: 1em"></div>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                        <div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="7">
                    <el-card class="box-card3" shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>速记</span>
                            <el-tooltip class="item" effect="dark" content="内容将保存到【页面】/【便签页面】" placement="top-start">
                                <span><i class="el-icon-warning-outline"></i></span>
                            </el-tooltip>
                        </div>
                        <el-input
                                type="textarea"
                                :rows="7"
                                placeholder="写点什么吧..."
                                v-model="note.content">
                        </el-input>
                        <el-button type="primary" size="small" style="margin-top: 10px" @click="saveNote">保存</el-button>
                    </el-card>
                </el-col>
                <el-col :span="7">
                    <el-card class="box-card4" shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>操作记录</span>
                            <span><i class="el-icon-more"></i></span>
                        </div>
                        <div v-for="handle in record.handleList">
                            <div v-text="handle.message"></div>
                            <div class="time" v-text="getDateDiff(handle.time)"></div>
                            <el-divider></el-divider>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: "system-dashboard",
        beforeCreate() {
        },
        created(){
            this.loadBaseMessage();
            this.loadRecord();
        },
        data(){
            return {
                note:{
                    id:"",
                    createTime:"",
                    content:"",
                    updateTime:""
                },
                record:{},
                days:"",
                message:{},
                activities: [{
                    content: '支持使用图标',
                    timestamp: '2018-04-12 20:46',
                    size: 'large',
                    type: 'primary',
                    icon: 'el-icon-more'
                }, {
                    content: '支持自定义颜色',
                    timestamp: '2018-04-03 20:46',
                    color: '#0bbd87'
                }, {
                    content: '支持自定义尺寸',
                    timestamp: '2018-04-03 20:46',
                    size: 'large'
                }, {
                    content: '默认样式的节点',
                    timestamp: '2018-04-03 20:46'
                }]
            }
        },
        methods: {
            toNextPage(path) {
                this.$router.push("/admin/system/" + path);
            },
            toNextPageAbout() {
                this.$router.push("/index/about");
            },
            loadBaseMessage(){
                this.$http.get("/api/admin/message").then(resp=>{
                    this.message = resp.data;
                    let days = (new Date().getTime() - new Date(resp.data.createdDate).getTime()) / 1000 / 60 / 60 / 24;
                    this.days = Math.floor(days);
                }).catch(error =>{});
            },
            loadRecord(){
                this.$http.get("/api/dashboard/find/message").then(resp =>{
                    this.record = resp.data;
                }).catch(error =>{});
            },
            // 时间戳转多少分钟之前
            getDateDiff(dateTimeStamp) {
                // 时间字符串转时间戳
                var timestamp = new Date(dateTimeStamp).getTime();

                var minute = 1000 * 60;
                var hour = minute * 60;
                var day = hour * 24;
                var halfamonth = day * 15;
                var month = day * 30;
                var year = day * 365;
                var now = new Date().getTime();
                var diffValue = now - timestamp;
                var result;
                if (diffValue < 0) {
                    return;
                }
                var yearC = diffValue / year;
                var monthC = diffValue / month;
                var weekC = diffValue / (7 * day);
                var dayC = diffValue / day;
                var hourC = diffValue / hour;
                var minC = diffValue / minute;
                if (yearC >= 1) {
                    result = "" + parseInt(yearC) + "年前";
                } else if (monthC >= 1) {
                    result = "" + parseInt(monthC) + "月前";
                } else if (weekC >= 1) {
                    result = "" + parseInt(weekC) + "周前";
                } else if (dayC >= 1) {
                    result = "" + parseInt(dayC) + "天前";
                } else if (hourC >= 1) {
                    result = "" + parseInt(hourC) + "小时前";
                } else if (minC >= 1) {
                    result = "" + parseInt(minC) + "分钟前";
                } else
                    result = "刚刚";
                return result;
            },
            showPost(id){
                this.$router.push({name:'indexPost',query: {id: id}});
            },
            saveNote(){
                this.$http.post("/api/dashboard/save/note",this.note).then(resp=>{

                    this.$message.success("保存成功！")
                    this.note = {
                            id:"",
                            createTime:"",
                            content:"",
                            updateTime:""
                    }
                    this.loadBaseMessage();
                    this.loadRecord();
                }).catch(error =>{
                    this.$message.error("保存失败！")
                })
            }
        }
    }
</script>

<style scoped>
    .title {
        font-size: 22px;
        margin-bottom: 15px;
    }

    .text {
        font-size: 2em;
    }

    .box-card {
        width: 275px;
        height: 100px;
        margin-top: 10%;

    }

    .box-card2 {
        width: 392px;
        margin-top: 3%;
        margin-left: 20%;
    }

    .box-card3 {
        width: 392px;
        margin-top: 3%;
        margin-left: 21%;
    }

    .box-card4 {
        width: 392px;
        margin-top: 3%;
        margin-left: 22%;
    }

    .Breadcrumb {
        width: 100%;
        height: 48px;
    }

    .icon {
        float: right;
    }

    .time {
        float: right;
    }

    .dashboard {
        background-color: #F0F2F5;
        height: 100%;
        width: 100%;
    }

    .post {
        color: #303133;
        transition: 0.5s;
    }

    .post:hover{
        color: #0F9FB4;
        transition: 0.5s;
    }
</style>