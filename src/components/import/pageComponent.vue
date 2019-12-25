<template>
    <!--分页组件-->
    <div class="pageComponent" v-if="pageConfig.total">
        <!--上一页-->
        <a @click="prePage" v-show="currentPage != 1">上一页</a>
        <!--总页数小于8的-->
        <template v-if="pageTotal <= showPageNo">
            <a v-for="i in pageTotal" @click="changeCurrentPage(i)" :class="{active:i === currentPage}" :key="i">{{i}}</a>
        </template>
        <template v-else-if="currentPage < 4">
            <a v-for="i in 6" @click="changeCurrentPage(i)" :class="{active:i === currentPage}" :key="i">{{i}}</a>
            <span :disabled="true">···</span>
            <a @click="changeCurrentPage(pageTotal)">{{pageTotal}}</a>
        </template>
        <template v-else-if="currentPage > pageTotal - 4">
            <a @click="changeCurrentPage(1)">1</a>
            <a :disabled="true">···</a>
            <span v-for="i in 6" @click="changeCurrentPage(i + (pageTotal - 6))" :class="{active:(i + (pageTotal - 6)) === currentPage}" :key="i">{{i + (pageTotal - 6)}}</span>
        </template>
        <template v-else>
            <a @click="changeCurrentPage(1)">1</a>
            <span :disabled="true">···</span>
            <a @click="changeCurrentPage(currentPage - 2)">{{currentPage - 2}}</a>
            <a @click="changeCurrentPage(currentPage - 1)">{{currentPage - 1}}</a>
            <a class="active">{{currentPage}}</a>
            <a @click="changeCurrentPage(currentPage + 1)">{{currentPage + 1}}</a>
            <a @click="changeCurrentPage(currentPage + 2)">{{currentPage + 2}}</a>
            <span :disabled="true">···</span>
            <a @click="changeCurrentPage(pageTotal)">{{pageTotal}}</a>
        </template>
        <!--下一页-->
        <a @click="nextPage" v-show="currentPage != pageTotal">下一页</a>
    </div>
</template>

<script>
    export default {
        name: "pageComponent",
        props: {
            // 分页配置
            pageConfig: {
                type: Object, require: true, default() {
                    return {
                        pageSize: 10,     //一页的数据条数
                        pageNo: 0,        //当前页的索引
                        total: 0,         //总的数据条数
                        pageTotal: 0      //总的页数
                    }
                }
            }
        },
        data() {
            return {
                //默认显示
                showPageNo:8,
                currentPage:0
            }
        },
        methods: {
            prePage(){
                this.currentPage -= 1
                this.$emit('changeCurrentPage',this.currentPage)
            },
            nextPage(){
                this.currentPage += 1
                this.$emit('changeCurrentPage',this.currentPage)
            },
            changeCurrentPage(i){
                this.currentPage = i
                this.$emit('changeCurrentPage',this.currentPage)
            }
        },
        computed: {
            //计算总页数，如果传了pageTotal,直接取pageTotal的值，如果传了total，那么根据pageSize去计算
            pageTotal(){
                const config = this.pageConfig
                if(config.pageTotal){
                    return config.pageTotal
                }else {
                    if(config.pageSize && config.total){
                        return Math.ceil(config.total/config.pageSize)
                    }else {
                        return 0
                    }
                }
            }
        },
        created: function () {
            this.currentPage = this.pageConfig.pageNo || 0
        }
    }
</script>

<style lang="scss">
    .pageComponent {
        a{
            margin: 0 5px;
            background-color: #16212B;
            border-bottom: 2px #16212B solid;
            color: #CECECE;
            font-weight: 600;
            outline:none;
            padding: 0 4px;
            vertical-align: top;
            display: inline-block;
            font-size: 14px;
            min-width: 15.5px;
            height: 28px;
            line-height: 28px;
            cursor: pointer;
            box-sizing: border-box;
            text-align: center;
            transition:1s;
            &[disabled]{
                color: #c0c4cc;
                cursor: not-allowed;
            }
            &.active{
                color: #0F9FB4;
            }
        }

        span {
            margin: 0 5px;
            background-color: #16212B;
            border-bottom: 2px #16212B solid;
            color: #CECECE;
            font-weight: 600;
            outline:none;
            padding: 0 4px;
            vertical-align: top;
            display: inline-block;
            font-size: 14px;
            min-width: 35.5px;
            height: 28px;
            line-height: 28px;
            cursor: pointer;
            box-sizing: border-box;
            text-align: center;
            transition:1s;
            &.active{
                color: #0F9FB4;
            }
        }

        a:hover {
            border-bottom: 2px #0F9FB4 solid;
            color: #0F9FB4;
            transition:1s;
        }
    }
</style>