<template>
    <div style="width: 800px">
        <div class="category">关于我</div>
            <div class="markdown-body text" v-html="post.html"></div>
        <!--  Valine评论系统：id 将作为查询条件 -->
        <div id="vcomments" class="commentComponent" v-show="post.comment == 1"></div>
    </div>
</template>

<script>
    import Valine from 'valine';
    export default {
        name: "index-about",
        created(){
            this.$http.get("/api/comment/info/find").then(resp=>{
                this.commentInfo = resp.data;
            }).catch(error =>{});
                this.showPost();
        },
        data(){
            return {
                post:{},
                accessNum:"",
                commentInfo:{}
            }
        },
        methods: {
            showPost(){
                this.$http.get("/api/admin/about/find").then(resp => {
                    this.post = resp.data;
                    this.accessNum = resp.data.accessNum + 1;
                    new Valine({
                        el:'#vcomments',
                        appId: this.commentInfo.appID,//LeanCloud配置
                        appKey: this.commentInfo.appKey,//LeanCloud配置
                        notify:false,//评论回复邮件提醒
                        verify:true,//验证码服务
                        avatar:'mp',
                        placeholder: 'write someting...',
                        path:window.location.pathname+"?id="+this.post.id,//每个文章页的地址
                        avatar:"identicon",
                        meta:['nick','mail','link'],//评论者相关内容
                        pageSize:"10",//评论分页每页条数
                        visitor:true,//阅读量统计
                        recordIP:true
                    })
                }).catch(error => {
                    this.$message.error("数据查询失败！");
                });
                //访问统计
                this.$http.put("/api/post/show/save/accessNum",this.$qs.stringify({id:id})).then(resp=>{}).catch(error =>{});
            }
        }
    }
</script>

<style scoped>
    @import "../assets/css/markdown.css";
    @import "../assets/css/googlecode.css";

    .text {
        padding: 0px 40px 0px 40px;
    }

    .category{
        margin: 70px 0px 40px 40px;
        font-size: 35px;
        color: #CECECE;
        font-weight: 700
    }

    .commentComponent{
        width: 800px;
        border-width: 0px;
        margin: 50px 0px 0px 40px;
    }

    .commentComponent >>> .vwrap {/*整个评论系统UI样式*/
        background-color: #2D4356!important;
        border-radius: 0em!important;
        color: #838E96!important;
        border-color: #223441!important;
    }

    .commentComponent >>> .vwrap:hover {/*整个评论系统UI样式动作*/
        box-shadow: rgba(0,0,0,0.8) 0px 0px 5px;
        transition:0.4s;
    }

    .commentComponent >>> .vinput {/*所由输入框*/
        color: #838E96!important;
        font-size: 0.8em!important;
        border-bottom: 1px dashed #223441!important;
    }

    .commentComponent >>> .veditor {/*编辑内容*/
        color: #838E96!important;
        font-size: 1em!important;
        border-bottom: 0px dashed #223441!important;
    }

    .commentComponent >>> path {/*左下角markdown小图标*/
        color: #CECECE!important;
    }

    .commentComponent >>> .vctrl {/*表情与预览中间竖线*/
        color: #CECECE!important;
    }

    .commentComponent >>> .vemoji-btn {/*表情字样*/
        color: #CECECE!important;
    }

    .commentComponent >>> .vpreview-btn {/*预览字样*/
        color: #CECECE!important;
    }

    .commentComponent >>> .vsubmit {/*回复按钮*/
        background-color: #2D4356!important;
        border-radius: 0em!important;
        color: #CECECE!important;
    }

    .commentComponent >>> .vbtn:hover {/*回复按钮动作*/
        color: #3090e4;
        border-color: #3090e4;
        background-color: #ffffff!important;
    }

    .commentComponent >>> .power{/*隐藏valine字样*/
        /*display: none!important;*/
    }

    .commentComponent >>> .vnum {/*评论显示区评论总数*/
        color: #CECECE!important;
    }

    .commentComponent >>> .vcount {/*评论显示区评论字样*/
        color: #CECECE!important;
    }

    .commentComponent >>> .vsys {/*评论显示区名字旁系统和浏览器字样*/
        background-color: #203240!important;
    }

    .commentComponent >>> p{/*评论显示区内容式样*/
        color:#CECECE;
    }

    .commentComponent >>> a{/*评论显示区内容式样*/
        color:#0F9FB4;
    }

</style>