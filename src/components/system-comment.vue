<template>
    <div>
        <div>
            <el-card class="Breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/admin/system/dashboard' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>评论</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </div>
        <div style="margin-top: 2%;margin-left: 5%;margin-right: 5%">
            <el-card align="center" style="min-height: 600px">
                <div align="left">
                    <span style="margin-right: 1%;margin-left: 40px">关键字:</span><span style="margin-right: 1%"><el-input
                        v-model="pageInfo.keyword" placeholder="时间、内容、发言人和邮箱关键字" style="width: 22%"
                        size="medium"></el-input></span>
                    <span style="padding-right: 1%"><el-button type="primary" size="medium" @click="loadCommentTable">查询</el-button></span>
                </div>
                <div class="table" style="margin-top: 2%">
                    <div align="left" style="margin-left: 25px">
                        <el-button size="mini" v-show="multipleSelection.length>0" @click="deleteComment2">删除</el-button>
                    </div>
                    <el-table
                            :data="tableData"
                            style="width: 95%;font-size: 14px"
                            stripe
                            size="mini"
                            @selection-change="handleSelectionChange"
                            @sort-change="sortChange"
                            :default-sort="{prop: 'insertedAt', order: 'descending'}">
                        <el-table-column
                                type="selection"
                                width="40">
                        </el-table-column>
                        <el-table-column
                                prop="insertedAt"
                                label="时间"
                                width="160"
                                align="center"
                                sortable="custom">
                        </el-table-column>
                        <el-table-column label="内容" align="center" width="280">
                            <template slot-scope="scope">
                                <div>
                                    <div v-html="scope.row.comment"></div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="发言者"
                                width="120"
                                prop="nick"
                                align="center"
                                sortable="custom">
                        </el-table-column>
                        <el-table-column
                                label="发言者邮箱"
                                width="180"
                                prop="mail"
                                align="center"
                                sortable="custom">
                        </el-table-column>
                        <el-table-column label="所属文章" align="center" width="150">
                            <template slot-scope="scope">
                                <div v-if="scope.row.postTitleVo.id == -1">
                                    <a href="javascript:void(0)" v-text="scope.row.postTitleVo.title" @click="toAbout" style="color: #ef9700"></a>
                                </div>
                                <div v-else>
                                    <a href="javascript:void(0)" v-text="scope.row.postTitleVo.title" @click="showPost(scope.row.postTitleVo.id)"></a>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="发言者链接" align="center" width="90">
                            <template slot-scope="scope">
                                <div>
                                    <el-tooltip class="item" effect="dark" :content="scope.row.link" placement="top-start">
                                        <a href="#" @click.prevent="toLink(scope.row.link)">link</a>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <div>
                                    <a href="javascript:void(0)" @click="deleteComment(scope.row.objectId)">删除</a>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="block">
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :page-sizes="pageSizes"
                                layout="total, sizes, prev, pager, next, jumper"
                                pager-count="7"
                                :total="totalElements"
                                style="padding-top: 1%"
                                align="center">
                        </el-pagination>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "system-comment",
        created() {
            this.loadCommentTable();
        },
        data() {
            return {
                totalElements: "",
                pageSizes: [5, 10, 15, 20],
                pageInfo: {
                    pageSize: "10",
                    currentPage: "1",
                    order: "",
                    prop: "",
                    keyword: ""
                },
                tableData: [],
                multipleSelection: [],
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChange(val) {
                this.pageInfo.pageSize = val;
                this.loadCommentTable();
            },
            handleCurrentChange(val) {
                this.pageInfo.currentPage = val;
                this.loadCommentTable();
            },
            loadCommentTable() {
                this.$http.get("/api/comment/find/all/factor", {
                    params: {
                        currentPage: this.pageInfo.currentPage, // 当前页
                        pageSize: this.pageInfo.pageSize, // 每页条数
                        prop: this.pageInfo.prop, // 排序字段
                        order: this.pageInfo.order, // 是否降序
                        keyword: this.pageInfo.keyword,
                    }
                }).then(resp => {
                    this.tableData = resp.data.content;
                    this.totalElements = resp.data.totalElements;
                }).catch(error=>{});
            },
            deleteComment(id){
                this.$confirm('是否删除评论？(无法复原)',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete("/api/comment/delete/id",{params: {id: id}}).then(resp => {
                        this.$message.success("删除成功！");
                        this.loadCommentTable();
                    }).catch(error => {
                        this.$message.error("删除失败！");
                        this.loadCommentTable();
                    });
                }).catch(() => {
                });
            },
            deleteComment2(){
                this.$confirm('是否删除选中评论？(无法复原)',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete("/api/comment/delete/ids",{data: this.multipleSelection}).then(resp => {
                        this.$message.success("删除成功！");
                        this.loadCommentTable();
                    }).catch(error => {
                        this.$message.error("删除失败！");
                        this.loadCommentTable();
                    });
                }).catch(() => {
                });
            },
            sortChange(obj){
                this.pageInfo.prop = obj.prop;
                this.pageInfo.order = obj.order;
                this.loadCommentTable();
            },
            toLink(link){
                window.open(link);
            },
            showPost(id){
                this.$router.push({name:'indexPost',query: {id: id}});
            },
            toAbout(){
                this.$router.push({name:'indexAbout'});
            }
        }
    }
</script>

<style scoped>
    .Breadcrumb {
        width: 100%;
        height: 48px;
    }
</style>