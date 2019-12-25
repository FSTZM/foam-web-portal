<template>
    <div class="page">
        <div class="category">Categories</div>
        <div class="categoryItem">
            <ul v-for="(item,index) in categoryList" :key="index">
                <tree-item :data="item"></tree-item>
            </ul>
        </div>
    </div>
</template>

<script>
    import treeItem from '../components/import/categoryItem'
    export default {
        name: "index-categories",
        components: {
            // 这里别忘了注册子组件
            treeItem
        },
        created(){
            this.$http.get("/api/post/show/find/category/options").then(resp => {

                this.categoryList = resp.data;
            }).catch(error=>{});
        },
        data(){
            return{
                categoryList:[]
            }
        },
        methods:{

        }
    }
</script>

<style scoped>
    .category{
        margin: 70px 0px 40px 40px;
        font-size: 35px;
        color: #CECECE;
        font-weight: 700
    }

    .categoryItem {
        margin: 0px 0px 10px 20px;
    }

    .page {
        min-height: 70%;
        width: 800px;
    }

</style>