<template>
    <div class="container">
        <div class="left">

            <div align="left" style="width: 210px;padding-top: 45px;padding-left: 45px">
                <div style="width: 140px;height: 140px;border-radius: 50%;border: 2px solid #0F9FB4;" align="center">
                    <div style="padding-top: 5px">
                        <el-avatar :size="130" fit="scale-down" :src="imgUrl">
                        </el-avatar>
                    </div>
                </div>
                <div style="width:144px;margin-top: 20px;font-size: 17px;" align="center">
                    <a href="javascript:void(0)" v-text="user.nickname" class="changeColor"
                       @click="toNextPage('index')"></a>
                </div>
            </div>
            <div class="background2">
                <div style="width: 210px;padding-top: 15px;line-height: 20px;font-size: 12px;color: #CECECE">
                    <p v-text="description"></p>
                </div>
            </div>
            <div align="left" style="width: 210px;padding-top: 15px;padding-left: 45px;font-size: 12px">
                <div style="margin-top: 15px;">
                    <a class="changeColor" href="#" @click="toNextPage('index')">
                        <div class="circle"></div>
                        主页</a>
                </div>
                <div style="margin-top: 15px;">
                    <a class="changeColor" href="#" @click="toNextPage('archives')">
                        <div class="circle"></div>
                        归档</a>
                </div>
                <div style="margin-top: 15px;">
                    <a class="changeColor" href="#" @click="toNextPage('categories')">
                        <div class="circle"></div>
                        分类</a>
                </div>
                <div style="margin-top: 15px;">
                    <a class="changeColor" href="#" @click="toNextPage('tags')">
                        <div class="circle"></div>
                        标签</a>
                </div>
                <div style="margin-top: 15px;">
                    <a class="changeColor" href="#" @click="toNextPage('about')">
                        <div class="circle"></div>
                        关于</a>
                </div>
                <div style="margin-top: 5px;">
                    <input type="text"
                           style="background: transparent;border-bottom: 1px solid #0F9FB4;height: 30px;width: 150px;color: #CECECE"
                           placeholder="搜索" onfocus="this.placeholder=''"
                           onblur="this.placeholder='搜索'"
                           v-model="title"></input>
                    <div>
                        <div v-for="post in searchResult" style="width: 200px;margin: 10px">
                            <span style="margin-bottom: 5px"><a href="#" class="searchResult" v-text="post.title" @click.prevent="showPost(post.id)"></a></span>
                            <span v-text="post.description" class="text"></span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="right">
            <router-view></router-view>
            <div style="margin-top: 65px;margin-bottom: 30px;margin-left: 40px;">
                <div>made by Reddes
                    <span style="color: #CECECE;font-size: 0.9em">
                        <i class="el-icon-view" style="margin-right: 0.3em;margin-left: 2em"></i><em class="post-meta-item-text"></em>
                        <i v-text="totalAccessNum"></i>
                    </span>
                </div>
            </div>

        </div>
        <el-backtop></el-backtop>
    </div>
</template>

<script>
    export default {
        name: "index",
        created(){
            this.$http.get("/api/post/show/user").then(resp=>{
                this.imgUrl = resp.data.avatar;
                this.user.nickname = resp.data.nickname;
                this.description = resp.data.description;
                document.title = resp.data.nickname + "的博客";
            }).catch(error=>{});
            this.$http.get("/api/post/show/total/accessNum").then(resp=>{
                this.totalAccessNum = resp.data;
            }).catch(error=>{});
        },
        data() {
            return {
                imgUrl: "",
                user: {
                    nickname: "...",
                    description: "..."
                },
                title: "",
                searchResult: [],
                totalAccessNum:""
            }
        },
        watch: {
            title(val, oldVal) {
                this.search();
            }
        },
        methods: {
            toNextPage(path) {
                this.$router.push("/index/" + path);
            },
            search() {
                this.$http.get("/api/post/show/find/index/title",{
                    params:{
                        title: this.title
                    }}).then(resp => {
                    this.searchResult = resp.data;
                }).catch(error=>{})
            },
            showPost(id){
                this.$router.push({name:'indexPost',query: {id: id}});
            }

        }
    };
</script>

<style scoped>
    .container {
        display: grid;
        grid-template-columns: 320px auto;
        grid-template-rows: auto;
        background: url("../assets/background.png") no-repeat, #2D4356 320px;
        background-size: 320px 100%; /*使背景图宽从400px变320px*/
        min-height: 120%;
    }

    .left {
        grid-column-start: 1;
        grid-column-end: 2;
        width: 320px;
        height: 100%;
    }

    .right {
        grid-column-start: 2;
        grid-column-end: 3;
        color: #CECECE;
    }

    .background2 {
        background: url("../assets/background2.jpg") no-repeat;
        background-size: 320px 90px;
        height: 90px;
        margin-top: 20px;
        padding-left: 45px;
    }

    .changeColor {
        color: #CECECE;
        transition: 0.5s;
    }

    .changeColor:hover {
        color: #0F9FB4;
        transition: 0.5s;
    }

    .changeColor:hover .circle {
        background: #0F9FB4;
        transition: 0.5s;
    }

    .circle {
        display: inline-block;
        margin-left: -20px;
        margin-right: 14px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #2D4356;
        transition: 0.5s;
    }

    /*修改提示文字的颜色*/

    input::-webkit-input-placeholder { /* WebKit browsers */
        color: white;
        font-weight: 500;
    }

    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: white;
    }

    input::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: white;
        font-size: 12px;
    }

    input:-ms-input-placeholder { /* Internet Explorer 10+ */
        color: white;
    }

    .searchResult {
        display:block;
        word-wrap:break-word;
        font-size: 12px;
        font-weight: 600;
        line-height: 20px;
        margin-left: -30px;
        color: #649CD9;
        transition: 0.5s;
    }

    .searchResult:hover {
        color: #0F9FB4;
        transition: 0.5s;
    }

    .text{
        font-size:12px;
        color:#CECECE;
        line-height: 20px;
        margin-left: -30px;
        word-wrap:break-word;
        display:block;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        word-break:keep-all;
    }

    .el-backtop {
        border-radius: 0%;
        background-color: #425667;
        color: #88929B;
        transition: 0.2s;
    }

    .el-backtop:hover {
        transition: 0.2s;
    }
</style>
