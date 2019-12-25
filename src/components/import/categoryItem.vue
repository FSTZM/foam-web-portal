<template>
    <span>
        <a href="#" @click.prevent="toNextPage(data[treeProps.id])" v-text="data[treeProps.label]"></a><i v-text="data[treeProps.num]"></i>
        <div>
            <tree-item v-for="(item, index) in data[treeProps.children]" :data="item" :key="index"
                       :treeProps="treeProps"></tree-item>
        </div>
    </span>
</template>

<script>
    export default {
        name: 'TreeItem', //递归组件必须有name
        props: {
            data: {
                type: [Object, Array], //多个可能的类型
                required: true
            },
            // label、children 默认值
            treeProps: {
                type: Object,
                default: () => ({
                    children: 'children',
                    label: 'categoryName',
                    id: 'id',
                    num: 'num'
                })
            }
        },
        methods:{
            toNextPage(categoryId){
                this.$router.push({name:'indexTimeline',query: {categoryId: categoryId}});
            }
        }
    }
</script>

<style scoped>
    div {
        margin: 10px 0px 0px 30px;
    }

    span {
        margin: 10px 0px 0px 30px;
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