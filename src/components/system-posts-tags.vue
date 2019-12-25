<template>
    <div>
        <div>
            <el-card class="Breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/admin/system/dashboard' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>文章</el-breadcrumb-item>
                    <el-breadcrumb-item>标签</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </div>
        <div style="margin-top: 1%">
            <el-row type="flex" justify="center" gutter="10">
                <el-col :span="3"></el-col>
                <el-col :span="19">
                    <div>
                        <el-card style="min-height: 410px">
                            <div slot="header">
                                <span style="font-size: 17px" v-show="show">添加标签</span>
                                <span style="font-size: 17px" v-show="!show">修改标签</span>
                            </div>
                            <div>
                                <el-form label-position="top" label-width="80px" :model="postTag" size="mini"
                                         status-icon
                                         :rules="rules" ref="ruleForm">
                                    <el-form-item label="标签名称：" prop="tagName">
                                        <el-input v-model="postTag.tagName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="描述：">
                                        <el-input
                                                type="textarea"
                                                :rows="4"
                                                placeholder="请输入内容"
                                                v-model="postTag.description">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" size="small" @click="saveForm('ruleForm')"
                                                   v-show="show">保存
                                        </el-button>
                                        <el-button type="primary" size="small" @click="updateForm('ruleForm')"
                                                   v-show="!show">确认修改
                                        </el-button>
                                        <el-button size="small" @click="cancelShow" v-show="!show">取消</el-button>
                                        <el-popover
                                                placement="top-start"
                                                width="160"
                                                v-model="visible">
                                            <div style="padding: 5%">确定删除此标签?</div>
                                            <div style="text-align: right; margin: 0">
                                                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                                                <el-button type="primary" size="mini"  @click="handleDelete">确定</el-button>
                                            </div>
                                            <el-button type="danger" slot="reference" size="small" v-show="!show" style="margin-left: 56%">删除</el-button>
                                        </el-popover>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-card>
                    </div>
                </el-col>
                <el-col :span="23">
                    <div>
                        <el-card style="min-height: 410px">
                            <div slot="header">
                                <span style="font-size: 17px">所有标签</span>
                            </div>
                            <el-tag v-for="tag in tagData" :key="tag.tagName" @click="handleEdit(tag)" style="margin: 3px">
                                <el-tooltip class="item" effect="dark" :content="tag.postNum+'篇文章'" placement="top-start">
                                    <a href="javascript:void(0)"><span>{{tag.tagName}}</span></a>
                                </el-tooltip>
                            </el-tag>
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
        name: "system-posts-tags",
        beforeCreate() {
        },
        created() {
            this.loadTagData();
        },
        data() {
            return {
                visible:false,
                show: true,
                tagData: [],
                postTag: {
                    id: "",
                    tagName: "",
                    description: ""
                },
                rules: {
                    tagName: [
                        {required: true, message: "标签名称不能为空", trigger: "blur"},
                        {
                            min: 0,
                            max: 20,
                            message: "标签名称长度不能超过20",
                            trigger: "blur"
                        }
                    ]
                }
            }
        },
        methods: {
            saveForm(ruleForm) {
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        this.$http.post("/api/post/save/tag", this.postTag).then(resp => {
                            if (resp.status == 201) {
                                this.$message.success("保存成功！");
                                this.loadTagData();
                                this.postTag = {
                                    id: "",
                                    tagName: "",
                                    description: ""
                                }
                                this.show = true;
                            }
                        }).catch(error=>{});
                    } else {
                        return false;
                    }
                });
            },
            updateForm(ruleForm) {
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        this.$http.put("/api/post/update/tag", this.postTag).then(resp => {
                            if (resp.status == 204) {
                                this.$message.success("修改成功！");
                                this.loadTagData();
                                this.postTag = {
                                    id: "",
                                    tagName: "",
                                    description: ""
                                }
                                this.show = true;
                            }
                        }).catch(error=>{});
                    } else {
                        return false;
                    }
                });
            },
            loadTagData() {
                this.$http.get("/api/post/find/tag").then(resp => {
                    this.tagData = resp.data;
                }).catch(error => {
                    this.$message.error("数据查询失败！");
                });
            },
            cancelShow() {
                this.show = true;
                this.postTag = {
                    id: "",
                    tagName: "",
                    description: ""
                }
            },
            handleEdit(tag) {
                this.show = false;
                this.postTag.description = tag.description;
                this.postTag.id = tag.id;
                this.postTag.tagName = tag.tagName;
            },
            handleDelete() {
                this.$http.delete("/api/post/delete/tag/one", {params: {id: this.postTag.id}}).then(resp => {
                    this.$message.success("删除成功！");
                    this.loadTagData();
                    this.postTag = {
                        id: "",
                        tagName: "",
                        description: ""
                    }
                    this.show = true;
                    this.visible =false;
                }).catch(error => {
                    this.$message.error("删除失败！");
                    this.visible =false;
                })
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