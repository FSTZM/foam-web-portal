<template>
    <div class="page">
        <div class="text">Tags</div>
        <div class="tags">
            <span v-for="tag in tagList" class="tag">
                <a href="#" @click.prevent="toNextPage(tag.id)" v-text="tag.tagName"></a><i v-text="tag.postNum"></i>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index-tag",
        created(){
            this.$http.get("/api/post/show/find/tag/options").then(resp => {

                this.tagList = resp.data;
            }).catch(error=>{})
        },
        data(){
            return{
                tagList:[]
            }
        },
        methods:{
            toNextPage(tagId){
                this.$router.push({name:'indexTimeline',query: {tagId: tagId}});
            }
        }
    }
</script>

<style scoped>
    .text{
        margin: 70px 0px 40px 40px;
        font-size: 35px;
        color: #CECECE;
        font-weight: 700
    }

    .tags {
        margin-left: 40px;
        width: 800px;
    }

    .tag {
        display: inline-block;
        margin: 0em 0.5em 0.5em 0em;
    }

    .page {
        min-height: 70%;
    }

    a {
        display:inline-block;
        color: #5F9EA0;
        font-size: 15px;
        font-weight: 600;
        background: #1F3041;
        padding: 10px 20px 10px 20px;
        border-radius: 5px;
        transition:0.2s;
    }

    a:hover {
        color: #FFFFFF;
        transition: 0.2s;
        transform: scale(1.2);
    }

    i {
        color: #00FFFF;
        margin-left: 10px;
        font-weight: 600;
    }
</style>