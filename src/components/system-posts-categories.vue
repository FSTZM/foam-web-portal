<template>
    <div>
        <div>
            <el-card class="Breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/admin/system/dashboard' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>文章</el-breadcrumb-item>
                    <el-breadcrumb-item>分类目录</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </div>
        <div style="margin-top: 1%">
            <el-row type="flex" justify="center" gutter="10">
                <el-col :span="3"></el-col>
                <el-col :span="19">
                    <div>
                        <el-card style="min-height: 510px">
                            <div slot="header">
                                <span style="font-size: 17px" v-show="show">添加分类</span>
                                <span style="font-size: 17px" v-show="!show">修改分类</span>
                            </div>
                            <div>
                                <el-form label-position="top" label-width="80px" :model="postCategory" size="mini"
                                         status-icon
                                         :rules="rules" ref="ruleForm">
                                    <el-form-item label="分类名称：" prop="categoryName">
                                        <el-input v-model="postCategory.categoryName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="上级目录：">
                                        <el-cascader
                                                :options="options"
                                                :props="props"
                                                v-model="postCategory.parentId"
                                                :show-all-levels="false"
                                                clearable></el-cascader>
                                    </el-form-item>
                                    <el-form-item label="描述：">
                                        <el-input
                                                type="textarea"
                                                :rows="4"
                                                placeholder="请输入内容"
                                                v-model="postCategory.description">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" size="small" @click="saveForm('ruleForm')" v-show="show">保存</el-button>
                                        <el-button type="primary" size="small" @click="updateForm('ruleForm')" v-show="!show">确认修改</el-button>
                                        <el-button size="small" @click="cancelShow" v-show="!show">取消</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-card>
                    </div>
                </el-col>
                <el-col :span="23">
                    <div>
                        <el-card style="min-height: 510px">
                            <div slot="header">
                                <span style="font-size: 17px">分类列表</span>
                            </div>
                            <div>
                                <el-table
                                        :data="tableData"
                                        style="width: 100%">
                                    <el-table-column
                                            prop="categoryName"
                                            label="分类名称"
                                            width="120"
                                            align="center">
                                    </el-table-column>
                                    <el-table-column
                                            prop="description"
                                            label="描述"
                                            width="230"
                                            align="center">
                                    </el-table-column>
                                    <el-table-column
                                            prop="postNum"
                                            label="文章数"
                                            width="80"
                                            align="center">
                                    </el-table-column>
                                    <el-table-column label="操作"
                                                     align="center">
                                        <template slot-scope="scope">
                                            <a href="javascript:void(0)" @click="handleEdit(scope.row.id)">编辑</a>&nbsp;|
                                                <a href="javascript:void(0)" slot="reference" @click="handleClose(scope.row.id,scope.row.categoryName)">删除</a>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div>
                                <div class="block" align="center">
                                    <el-pagination
                                            @size-change="handleSizeChange"
                                            @current-change="handleCurrentChange"
                                            :page-sizes="pageSizes"
                                            pager-count="7"
                                            layout="total, sizes, prev, pager, next, jumper"
                                            :total="totalElements">
                                    </el-pagination>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </el-col>
                <el-col :span="3"></el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: "system-posts-categories",
        beforeCreate() {
        },
        created() {
            this.loadingTables();
            this.loadingOptions();
        },
        data() {
            return {
                show:true,
                tableData: [],
                totalElements: "",
                pageSizes: [5, 10, 15],
                pageInfo: {
                    total: "",
                    pageSize: "10",
                    currentPage: "1",
                },
                postCategory: {
                    id: "",
                    categoryName: "",
                    parentId: [],
                    description: ""

                },
                options: [],
                props: {
                    checkStrictly: true,
                    label: 'categoryName',
                    value: 'id',
                    children: 'children'
                },
                rules: {
                    categoryName: [
                        {required: true, message: "分类名称不能为空", trigger: "blur"},
                        {
                            min: 0,
                            max: 50,
                            message: "分类名称长度不能超过50",
                            trigger: "blur"
                        }
                    ]
                }
            }
        },
        methods: {
            handleSizeChange(val) {
                this.pageInfo.pageSize = val;
                this.loadingTables();
            },
            handleCurrentChange(val) {
                this.pageInfo.currentPage = val;
                this.loadingTables();
            },
            saveForm(ruleForm) {
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        this.$http.post("/api/post/save/category", this.postCategory).then(resp => {
                            if (resp.status == 201) {
                                this.$message.success("保存成功！");
                                this.loadingTables();
                                this.loadingOptions();
                                this.postCategory = {
                                    id: "",
                                    categoryName: "",
                                    parentId: [],
                                    description: ""
                                }
                                this.show = true;
                            }
                        }).catch(error =>{});
                    } else {
                        return false;
                    }
                });
            },
            updateForm(ruleForm) {
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        this.$http.put("/api/post/update/category", this.postCategory).then(resp => {
                            if (resp.status == 204) {
                                this.$message.success("修改成功！");
                                this.loadingTables();
                                this.loadingOptions();
                                this.postCategory = {
                                    id: "",
                                    categoryName: "",
                                    parentId: [],
                                    description: ""
                                }
                                this.show = true;
                            }
                        }).catch(error =>{});
                    } else {
                        return false;
                    }
                });
            },
            loadingTables() {
                this.$http.get("/api/post/find/category", {
                    params: {
                        currentPage: this.pageInfo.currentPage, // 当前页
                        pageSize: this.pageInfo.pageSize, // 每页条数
                    }
                }).then(resp => {

                    this.tableData = resp.data.content;
                    this.totalElements = resp.data.totalElements;
                }).catch(error => {
                    this.$message.error("表格数据加载失败！");
                });

            },
            loadingOptions() {
                this.$http.get("/api/post/find/category/options").then(resp => {
                    this.options = resp.data;
                }).catch(error => {
                    this.$message.error("上级目录数据加载失败！");
                });
            },
            handleEdit(id) {
                this.$http.get("/api/post/find/category/one", {params: {id: id}}).then(resp => {
                    this.show = false;
                    this.postCategory.id = resp.data.id;
                    this.postCategory.description = resp.data.description;
                    this.postCategory.parentId = resp.data.parentId;
                    this.postCategory.categoryName = resp.data.categoryName;

                }).catch(error => {
                    this.$message.error("请求失败！");
                })

            },
            handleDelete(id) {
                this.$http.delete("/api/post/delete/category/one", {params: {id: id}}).then(resp => {
                    this.$message.success("删除成功！");
                    this.loadingTables();
                    this.loadingOptions();
                    this.postCategory = {
                        id: "",
                        categoryName: "",
                        parentId: [],
                        description: ""
                    }
                    this.show = true;
                }).catch(error => {
                    this.$message.error("删除失败！");
                })
            },
            cancelShow() {
                this.show = true;
                this.postCategory = {
                    id: "",
                    categoryName: "",
                    parentId: [],
                    description: ""
                }
            },
            handleClose(id,title){
                this.$confirm('是否删除分类【'+title+'】？(同时会删除其下所有子分类)',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleDelete(id);
                }).catch(() => {
                });
            },
        }
    }
</script>

<style scoped>
    .Breadcrumb {
        width: 100%;
        height: 48px;
    }
</style>