<template>
    <div>
        <div  v-for="(post,i) in pageConfigPageTotal.content">
            <div class="post">
                <div style="padding: 40px;padding-bottom: 60px">
                    <div>
                        <a href="javascript:void(0);" class="title changeColor" style="font-size: 26px;font-weight: 700" v-text="post.fileTitle" @click="showPost(post.id)"></a>
                        <span class="el-icon-upload2" style="font-size: 15px;float:right;" v-if="post.top==1">Top</span>
                    </div>
                    <p style="margin-top: 40px;font-size: 15px;line-height: 25px" v-text="post.description"></p>

                    <div class="block" v-if="post.imgUrl!=''" align="center" style="margin-top: 30px;margin-bottom: 20px;">
                        <el-image :src="post.imgUrl" :preview-src-list="post.srcList"></el-image>
                    </div>
                </div>
                <div style="text-align: right;position:absolute; bottom:45px;right: 40px;">
                    <a class="changeColor" href="javascript:void(0);" @click="showPost(post.id)">阅读更多 > ></a>
                </div>
            </div>
            <div class="postMessage" style="padding-left: 40px">
                <i class="el-icon-date"></i><a href="javascript:void(0);" style="margin-left: 2px;margin-right: 25px" class="changeColor" v-text="post.date" @click="toNextPage()"></a>
                <i class="el-icon-folder"></i>
                <span v-for="(value, key) in post.categories" :key="key">
                    <a href="javascript:void(0);" style="margin-left: 2px;" class="changeColor" v-text="value" @click="toNextPage1(key)"></a>
                </span>
                <i class="el-icon-price-tag" style="margin-left: 25px"></i>
                <span v-for="(value, key) in post.tags" :key="key">
                    <a href="javascript:void(0);" style="margin-left: 2px;margin-right: 3px" class="changeColor" v-text="value" @click="toNextPage2(key)"></a>
                </span>
            </div>
        </div>
        <div style="height: 70px;width:100%;background: #16212B;margin-top: 70px">
            <div style="text-align: center;width: 920px;margin-left: -40px;height: 70px;padding-top: 19px">
                <page-component :page-config="pageConfigPageTotal" @changeCurrentPage="changePage"></page-component>
            </div>
        </div>
    </div>
</template>

<script>
        import pageComponent from './import/pageComponent.vue';
    export default {
        name: "index-index",
        components : {
            'page-component':pageComponent
        },
        created() {
            this.loadPosts();
        },
        watch: {
            "pageConfigPageTotal.pageNo":{//深度监听，可监听到对象、数组的变化
                handler(val, oldVal){
                    this.loadPosts();
                },
                deep:true
            }
        },
        data() {
            return {
                pageInfo: {
                    pageSize: "8",
                    currentPage: "1",
                    title: "",
                    state: 2,
                    categoryId: "",
                    tagId:""
                },
                pageConfigPageTotal:{
                    total:"",
                    pageSize:8,
                    pageNo:1,
                    pageTotal:"",
                    content:[]
                },
                num1:0,
                num2:0
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
            loadPosts(){
                this.pageInfo.currentPage = this.pageConfigPageTotal.pageNo;
                this.pageInfo.pageSize = this.pageConfigPageTotal.pageSize;
                this.pageInfo.state = 2;
                this.$http.get("/api/post/show/find/index/all", {
                    params:{
                        currentPage: this.pageInfo.currentPage,
                        pageSize: this.pageInfo.pageSize,
                        state: this.pageInfo.state,
                        category: this.pageInfo.categoryId,
                        tag: this.pageInfo.tagId,
                        title: this.pageInfo.title
                    }
                }).then(resp => {
                    this.pageConfigPageTotal.pageTotal = resp.data.totalPages;
                    this.pageConfigPageTotal.total = resp.data.totalElements;
                    this.pageConfigPageTotal.content= resp.data.content;
                    this.pageConfigPageTotal.content.forEach(post => {
                        post.srcList = [post.imgUrl];
                    })
                }).catch(error =>{});
            },
            changePage(page){
                this.pageConfigPageTotal.pageNo = page;
            },
            showPost(id){
                this.$router.push({name:'indexPost',query: {id: id}});
            }
        }
    }
</script>

<style scoped>
    @import "../assets/css/markdown.css";
    @import "../assets/css/googlecode.css";
    .post{
        background: #152029;
        width:920px;
        height:auto;
        min-height: 200px;
        margin-left: -40px;
        margin-top: 45px;
        margin-bottom: 20px;
        box-shadow: 0 0 40px rgba(0,0,0,0.5);
        transition:0.4s;
        position:relative;
    }

    .post:hover{
        webkit-box-shadow: rgba(0,0,0,0.8) 0px 0px 40px;
        -moz-box-shadow: rgba(0,0,0,0.8) 0px 0px 40px;
        box-shadow: rgba(0,0,0,0.8) 0px 0px 40px;
        transition:0.4s;
    }

    .postMessage{
        margin-bottom: 20px;
    }

    .changeColor {
        color: #CECECE;
        transition: 1s;
        font-size: 12px;
    }
    .changeColor:hover{color:#0F9FB4; transition:1s;}

    .sysBox .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #FD7A3A;
        color: #fff;
    }

</style>