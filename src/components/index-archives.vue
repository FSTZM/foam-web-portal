<template>
    <div class="boder">
        <div class="title">Archives</div>
        <div class="line" v-for="(value, key) in postData">
            <timeline>
                <timeline-title :hollow="true" font-color="#CECECE">{{key}}</timeline-title>
                <timeline-item :hollow="true" font-color="#CECECE"  v-for="post in value">
                    <i v-text="post.date"></i>
                    <a href="#" @click.prevent="showPost(post.id)" v-text="post.title"></a>
                </timeline-item>
            </timeline>
        </div>
        <div v-if="this.$qs.stringify(postData)==''" style="margin-left: 40px">暂无任何内容</div>
    </div>
</template>

<script>
    import Timeline from './import/timeline/timeline.vue';
    import TimelineItem from './import/timeline/timelineItem.vue';
    import TimelineTitle  from './import/timeline/timelineTitle.vue';
    export default {
        name: "index-archives",
        components: {
            Timeline,
            TimelineItem,
            TimelineTitle
        },
        created(){
            this.$http.get("/api/post/show/find/timeline",{params:{
                    tagId:undefined,
                    categoryId:undefined
                }}).then(resp => {
                this.postData = resp.data;
            }).catch(error=>{});
        },
        data(){
            return {
                postData:{},
            }
        },
        methods:{
            showPost(id){
                this.$router.push({name:'indexPost',query: {id: id}});
            }
        }

    }
</script>

<style scoped>
    .title{
        margin: 70px 0px 40px 40px;
        font-size: 35px;
        color: #CECECE;
        font-weight: 700
    }

    .line {
        margin-left: 40px;
    }

    a{
        margin-left: 0.3em;
        color: #1399AE;
        transition: 0.5s;
    }

    a:hover{
        color: #1E7A8E;
        transition: 0.5s;
    }

    .boder{
        width: 800px;
        min-height: 70%;
    }
</style>