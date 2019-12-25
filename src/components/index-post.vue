<template>
    <div>
        <div class="post">
            <div v-text="post.fileTitle" class="title"></div>
            <div class="postMessage">
                <i class="el-icon-date"></i><a href="javascript:void(0);" style="margin-left: 2px;margin-right: 25px" class="changeColor" v-text="post.date" @click="toNextPage()"></a>
                <i class="el-icon-folder"></i>
                <span v-for="(value, key) in post.categories" :key="key">
                   <a href="javascript:void(0);" style="margin-left: 2px;" class="changeColor" v-text="value" @click="toNextPage1(key)"></a>
                </span>
                <i class="el-icon-price-tag" style="margin-left: 25px"></i>
                <span v-for="(value, key) in post.tags" :key="key">
                    <a href="javascript:void(0);" style="margin-left: 2px;margin-right: 3px" class="changeColor" v-text="value" @click="toNextPage2(key)"></a>
                </span>
                    <i class="el-icon-view" style="margin-right: 0.3em;margin-left: 2em"></i><em class="post-meta-item-text"></em>
                    <i v-text="accessNum"></i>
            </div>
            <div class="markdown-body text" v-html="post.html"></div>
        </div>
        <div class="lastAndNext">
            <span v-for="(value, key) in last" class="last"><a class="last-next" href="#" v-text="'< '+value" @click.prevent="showPost(key)"></a></span>
            <span v-for="(value, key) in next" class="next"><a class="last-next" href="#" v-text="value+' >'" @click.prevent="showPost(key)"></a></span>
        </div>
                <!--  Valine评论系统：id 将作为查询条件 -->
        <div id="vcomments" class="commentComponent" v-show="post.comment == 1"></div>
    </div>
</template>

<script>
    import Valine from 'valine';
    export default {
        name: "index-post",
        created(){
            this.$http.get("/api/comment/info/find").then(resp=>{
                this.commentInfo = resp.data;
            }).catch(error =>{});
            const id = this.$route.query.id;
            if (id != undefined){
                this.showPost(id);
            }

        },
        data(){
            return {
                post:{},
                accessNum:"",
                last:{},
                Next:{},
                commentInfo:{}
            }
        },
        methods: {
            toNextPage(){
                this.$router.push({name:'indexTimeline'});
            },
            toNextPage1(categoryId){
                this.$router.push({name:'indexTimeline',query: {categoryId: categoryId}});
            },
            toNextPage2(tagId){
                this.$router.push({name:'indexTimeline',query: {tagId: tagId}});
            },
            showPost(id){
                this.$http.get("/api/post/show/find/index/"+id).then(resp => {
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
                        path:window.location.pathname+"?id="+id,//每个文章页的地址
                        avatar:"identicon",
                        meta:['nick','mail','link'],//评论者相关内容
                        pageSize:"10",//评论分页每页条数
                        visitor:true,//阅读量统计
                        recordIP:true,

                    })
                }).catch(error => {
                    this.$message.error("数据查询失败！");
                });
                //访问统计
                this.$http.put("/api/post/show/save/accessNum",this.$qs.stringify({id:id})).then(resp=>{}).catch(error =>{});
                this.$http.get("/api/post/show/last/next/"+id).then(resp =>{
                    this.last = resp.data[1];
                    this.next = resp.data[2];
                }).catch(error =>{});
            }
        }
    }
</script>

<style scoped>
    @import "../assets/css/markdown.css";
    @import "../assets/css/googlecode.css";

    .post {
        width: 920px;
        background: #152029;
        margin-top: 45px;
        margin-left: -40px;
        min-height: 800px;

    }

    .text {
        padding: 0px 40px 80px 40px;
    }

    .title {
        font-size: 3em;
        font-weight: 700;
        padding: 40px 0px 0px 40px;
        width: 840px;
        word-wrap:break-word;
    }

    .changeColor {
        color: #999999;
        transition: 1s;
        font-size: 12px;
    }

    .changeColor:hover{color:#0F9FB4; transition:1s;}

    .postMessage{
        margin-top: 0.5em;
        margin-bottom: 3em;
        padding-left:40px;
    }

    .lastAndNext {
        width: 800px;
        margin: 30px 0px 0px 40px;
    }

    .last-next {
        color: #CECECE;
        font-size: 1.1em;
        padding-bottom: 0.2em;
        transition: 1s;
        border-bottom: 2px #0F9FB4 solid;
    }

    .last-next:hover {
        color:#0F9FB4;
        transition: 1s;
    }

    .last{
        float: left;
        color: #CECECE;
    }

    .next{
        float: right;
        color: #CECECE;
    }

    .commentComponent{
        width: 800px;
        border-width: 0px;
        margin: 100px 0px 0px 40px;
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