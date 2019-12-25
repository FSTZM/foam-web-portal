<template>
    <div>
        <div>
            <el-card class="Breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/admin/system/dashboard' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>系统</el-breadcrumb-item>
                    <el-breadcrumb-item>博客设置</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </div>
        <div style="padding-left: 5%;width: 90%;padding-top: 2%">
            <el-tabs type="border-card" style="min-height: 500px">
                <el-tab-pane label="文件上传设置">
                    <el-form :model="uploadInfo" status-icon ref="uploadInfoForm" class="demo-ruleForm" :rules="rules"
                             label-position="top" size="mini">
                        <el-form-item label="储存位置" prop="storage">
                            <el-select v-model="uploadInfo.storage" placeholder="请选择" style="width: 30%"
                                       @change="findInfo(uploadInfo.storage)">
                                <el-option
                                        v-for="item in storage"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="EndPoint（地域节点）" prop="endPoint">
                            <div>
                                <el-input v-model="uploadInfo.endPoint" style="width: 30%"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="AccessKey ID" prop="accessKeyId">
                            <el-input v-model="uploadInfo.accessKeyId" style="width: 30%"></el-input>
                        </el-form-item>
                        <el-form-item label="Access Key Secret" prop="accessKeySecret">
                            <el-input :type="eye ? 'password' : 'text'" v-model="uploadInfo.accessKeySecret"
                                      style="width: 30%"></el-input>
                            <span style="margin-left: 1%"><a href="javascript:void(0)" @click="changePassword()"><i
                                    class="el-icon-view"></i></a></span>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('uploadInfoForm')">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="评论储存设置">
                    <div style="font-size: 2em;font-weight: 600;color: #606266;margin: 15px 0px">LeanCloud</div>
                    <el-form :model="commentInfo" status-icon ref="commentInfo" class="demo-ruleForm" :rules="rules2"
                             label-position="top" size="mini">
                        <el-form-item label="AppID" prop="appID">
                            <el-input v-model="commentInfo.appID" style="width: 30%"></el-input>
                        </el-form-item>
                        <el-form-item label="AppKey" prop="appKey">
                            <el-input :type="eye2 ? 'password' : 'text'" v-model="commentInfo.appKey"
                                      style="width: 30%"></el-input>
                            <span style="margin-left: 1%"><a href="javascript:void(0)" @click="changePassword2()"><i
                                    class="el-icon-view"></i></a></span>
                        </el-form-item>
                        <el-form-item label="MasterKey" prop="masterKey">
                            <el-input :type="eye3 ? 'password' : 'text'" v-model="commentInfo.masterKey"
                                      style="width: 30%"></el-input>
                            <span style="margin-left: 1%"><a href="javascript:void(0)" @click="changePassword3()"><i
                                    class="el-icon-view"></i></a></span>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm2('commentInfo')">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: "system-options",
        beforeCreate() {
        },
        created(){
            this.findCommentInfo();
        },
        data() {
            return {
                storage: [{
                    value: '1',
                    label: '阿里云'
                }/*, {
                    value: '2',
                    label: '七牛云'
                }, {
                    value: '3',
                    label: '腾讯云'
                }, {
                    value: '4',
                    label: '百度云'
                }, {
                    value: '5',
                    label: '又拍云'
                }*/],
                eye: "false",
                eye2: "false",
                eye3: "false",
                uploadInfo: {
                    storage: "",
                    endPoint: "",
                    accessKeyId: "",
                    accessKeySecret: ""

                },
                commentInfo: {
                    id:"",
                    appID: "",
                    appKey: "",
                    masterKey:""

                },
                rules: {
                    storage: [
                        { required: true, message: '请选择储存位置', trigger: 'change' }
                    ],
                    endPoint: [
                        { required: true, message: 'EndPoint（地域节点）不能为空', trigger: 'blur' }
                    ],
                    accessKeyId: [
                        { required: true, message: 'accessKeyId不能为空', trigger: 'blur' }
                    ],
                    accessKeySecret: [
                        { required: true, message: 'accessKeySecret不能为空', trigger: 'blur' }
                    ],
                },
                rules2: {
                    appID: [
                        { required: true, message: 'appID不能为空', trigger: 'blur' }
                    ],
                    appKey: [
                        { required: true, message: 'appKey不能为空', trigger: 'blur' }
                    ],
                    masterKey: [
                        { required: true, message: 'appKey不能为空', trigger: 'blur' }
                    ],
                },
            };
        },
        methods: {
            submitForm(uploadInfoForm) {
                this.$refs[uploadInfoForm].validate((valid) => {
                    if (valid) {
                        if (this.uploadInfo.storage == 1) {
                            this.$http.put("/api/file/upload/info/save", this.uploadInfo).then(resp => {
                                //保存成功
                                // 获取响应结果对象
                                if (resp.status === 204) {
                                    this.$message({
                                        message: "保存成功！",
                                        type: "success"
                                    });
                                }
                            }).catch(error => {
                                this.$message({
                                    message: "保存失败！",
                                    type: "error"
                                });
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            submitForm2(commentInfoForm) {
                this.$refs[commentInfoForm].validate((valid) => {
                    if (valid) {
                        if (this.commentInfo.id != "" && this.commentInfo.id != undefined) {

                            this.$http.put("/api/comment/info/update", this.commentInfo).then(resp => {
                                //保存成功
                                // 获取响应结果对象
                                this.$message({
                                    message: "修改成功！",
                                    type: "success"
                                });
                            }).catch(error => {
                                this.$message({
                                    message: "修改失败！",
                                    type: "error"
                                });
                            });

                        }else {

                            this.$http.post("/api/comment/info/save", this.commentInfo).then(resp => {
                                //保存成功
                                // 获取响应结果对象
                                this.$message({
                                    message: "保存成功！",
                                    type: "success"
                                });
                            }).catch(error => {
                                this.$message({
                                    message: "保存失败！",
                                    type: "error"
                                });
                            });
                        }

                    } else {
                        return false;
                    }
                });
            },
            findInfo(storage) {
                this.uploadInfo.endPoint = "";
                this.uploadInfo.accessKeyId = "";
                this.uploadInfo.accessKeySecret = "";
                if (storage == 1) {

                    this.$http.get("/api/file/upload/info/find",{params:{storage: storage}}).then(resp => {
                        //查找成功
                        // 获取响应结果对象
                        this.uploadInfo.endPoint = resp.data.endpoint;
                        this.uploadInfo.accessKeyId = resp.data.accessKeyId;
                        this.uploadInfo.accessKeySecret = resp.data.accessKeySecret;

                    }).catch(error => {
                        this.$message({
                            message: "查找数据失败！",
                            type: "error"
                        });
                    });
                }

            },
            findCommentInfo() {

                    this.$http.get("/api/comment/info/find").then(resp => {
                        //查找成功
                        // 获取响应结果对象
                        this.commentInfo = resp.data;
                    }).catch(error => {
                        this.$message({
                            message: "查找数据失败！",
                            type: "error"
                        });
                    });
            },
            changePassword() {
                this.eye = !this.eye;
            },
            changePassword2() {
                this.eye2 = !this.eye2;
            },
            changePassword3() {
                this.eye3 = !this.eye3;
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