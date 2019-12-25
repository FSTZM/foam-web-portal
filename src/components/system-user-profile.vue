<template>
    <div>
        <div>
            <el-card class="Breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/admin/system/dashboard' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>用户</el-breadcrumb-item>
                    <el-breadcrumb-item>个人资料</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </div>
        <div>
            <el-row type="flex" justify="center" gutter="10">
                <el-col :span="3"></el-col>
                <el-col :span="19">
                    <div>
                        <el-card style="min-height: 710px">
                            <div align="center">
                                <a href="javascript:void(0)" @click="dialogVisible = true">
                                    <el-avatar :size="105" :src="avatar" @error="errorHandler"
                                               fit="scale-down"></el-avatar>
                                </a>
                                <el-dialog
                                        title="上传头像"
                                        :visible.sync="dialogVisible"
                                        width="30%">
                                    <div style="margin-bottom: 5%">头像图片素材需要长宽相等，如1200x1200</div>
                                    <div style="margin-bottom: 5%">注：头像在附件处上传头像后将头像url替代下方url即可</div>
                                    <el-input v-model="avatar" placeholder="请输入头像url" size="mini" style="width: 350px"
                                              clearable></el-input>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="dialogVisible = false">取 消</el-button>
                                        <el-button type="primary" @click="changeAvatar">保存</el-button>
                                    </span>
                                </el-dialog>
                            </div>
                            <div style="margin-top: 2%;margin-bottom: 7%;font-size: 28px" align="center"
                                 v-text="showUser.nickname"></div>
                            <div style="margin-top: 2%;font-size: 15px"><i class="el-icon-mobile-phone"></i><span
                                    style="padding-left: 2%" v-text="showUser.phone"></span></div>
                            <div style="margin-top: 2%;font-size: 15px"><i class="el-icon-message"></i><span
                                    style="padding-left: 2%" v-text="showUser.email"></span></div>
                            <div style="margin-top: 2%;font-size: 15px"><i class="el-icon-date"></i><span
                                    style="padding-left: 2%;padding-right: 1%" v-text="showUser.days"></span>天
                            </div>
                            <el-divider></el-divider>
                            <div style="margin-top: 8%;font-size: 15px"><span>累计发表了</span><span
                                    style="padding-left: 1%;padding-right: 1%" v-text="message.postNum">0</span>篇文章。
                            </div>
                            <el-divider></el-divider>
                            <div style="margin-top: 0%;font-size: 15px"><span>累计创建了</span><span
                                    style="padding-left: 1%;padding-right: 1%" v-text="message.commentCount">0</span>条评论。
                            </div>
                            <el-divider></el-divider>
                            <div style="margin-top: 0%;font-size: 15px"><span>文章总访问</span><span
                                    style="padding-left: 1%;padding-right: 1%" v-text="message.totalAccessNum">0</span>次。
                            </div>
                            <el-divider></el-divider>
                        </el-card>
                    </div>
                </el-col>
                <el-col :span="23">
                    <div>
                        <el-card style="min-height: 710px">
                            <div slot="header" class="clearfix">
                                <span style="margin-top: 2%;margin-bottom: 3%;font-size: 28px">个人资料</span>
                            </div>
                            <el-tabs v-model="activeName" type="card" @tab-click="handleClick"
                                     style="margin-top: -0px;margin-left: 0px">
                                <el-tab-pane>
                                    <span slot="label"><i class="el-icon-postcard"></i>基本资料</span>
                                    <el-form label-position="top" label-width="80px" :model="user1" size="mini"
                                             status-icon
                                             :rules="rule1" ref="ruleForm1">
                                        <el-form-item label="用户名：" prop="username">
                                            <el-input v-model="user1.username"></el-input>
                                        </el-form-item>
                                        <el-form-item label="昵称：" prop="nickname">
                                            <el-input v-model="user1.nickname"></el-input>
                                        </el-form-item>
                                        <el-form-item label="电话：">
                                            <el-input v-model="user1.phone"></el-input>
                                        </el-form-item>
                                        <el-form-item label="邮箱：">
                                            <el-input v-model="user1.email"></el-input>
                                        </el-form-item>
                                        <el-form-item label="个人说明：">
                                            <el-input
                                                    type="textarea"
                                                    :rows="4"
                                                    placeholder="请输入内容"
                                                    v-model="user1.description">
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" size="mini" @click="submitForm1('ruleForm1')">保存
                                            </el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-tab-pane>
                                <el-tab-pane>
                                    <span slot="label"><i class="el-icon-lock"></i>密码</span>
                                    <el-form label-position="top" label-width="80px" :model="user2" size="mini"
                                             status-icon
                                             :rules="rule2" ref="ruleForm2">
                                        <el-form-item label="原密码：" prop="oldPassword">
                                            <el-input type="password" v-model="user2.oldPassword"
                                                      autocomplete="off"></el-input>
                                        </el-form-item>
                                        <el-form-item label="新密码：" prop="password">
                                            <el-input type="password" v-model="user2.password"
                                                      autocomplete="off"></el-input>
                                        </el-form-item>
                                        <el-form-item label="确认密码：" prop="password2">
                                            <el-input type="password" v-model="user2.password2"
                                                      autocomplete="off"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" size="mini" @click="submitForm2('ruleForm2')">
                                                确认更改
                                            </el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-tab-pane>
                            </el-tabs>
                        </el-card>
                    </div>
                </el-col>
                <el-col :span="3">

                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: "system-user-profile",
        beforeCreate() {
        },
        created() {
            this.loadData();
            this.$http.get("/api/admin/message").then(resp=>{
                this.message = resp.data;
            }).catch(error =>{});
        },
        data() {
            let validateUsername = (rule, value, callback) => {
                if (/^[A-Za-z0-9]+$/.test(value) == false) {
                    callback(new Error("用户名只能包含数字和字母"));
                } else {
                    callback();
                }
            };

            let validateNickname = (rule, value, callback) => {
                if (/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(value) == false) {
                    callback(
                        new Error("用户昵称只能包含中文、英文、数字但不包括下划线等符号")
                    );
                } else {
                    callback();
                }
            };

            // 确认密码
            let validatePassword2 = (rule, value, callback) => {
                if (value !== this.user2.password) {
                    callback(new Error("两次输入密码不一致!"));
                } else {
                    callback();
                }
            };
            return {
                dialogVisible: false,
                message:{},
                showUser: {
                    phone: "",
                    nickname: "",
                    email: "",
                    days: ""
                },
                user1: {
                    id: "",
                    username: "",
                    nickname: "",
                    phone: "",
                    email: "",
                    description: ""
                },
                user2: {
                    id: "",
                    oldPassword: "",
                    password: "",
                    password2: ""
                },
                avatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
                rule2: {
                    oldPassword: [
                        {required: true, message: "密码不能为空", trigger: "blur"}
                    ],
                    password: [
                        {required: true, message: "密码不能为空", trigger: "blur"},
                        {
                            min: 6,
                            max: 20,
                            message: "密码长度必须在6-20字符之间",
                            trigger: "blur"
                        }
                    ],
                    password2: [
                        {required: true, message: "确认密码不能为空", trigger: "blur"},
                        {
                            min: 6,
                            max: 20,
                            message: "确认密码长度必须在6-20字符之间",
                            trigger: "blur"
                        },
                        {validator: validatePassword2, trigger: "blur"}
                    ]
                },
                rule1: {
                    username: [
                        {required: true, message: "用户名不能为空", trigger: "blur"},
                        {validator: validateUsername, trigger: "blur"},
                        {
                            min: 6,
                            max: 20,
                            message: "用户名长度必须在6-20字符之间",
                            trigger: "blur"
                        }
                    ],
                    nickname: [
                        {required: true, message: "用户昵称不能为空", trigger: "blur"},
                        {validator: validateNickname, trigger: "blur"},
                        {
                            min: 0,
                            max: 20,
                            message: "用户昵称不能超过20个字符",
                            trigger: "blur"
                        }
                    ]
                }
            }
        },
        methods: {
            submitForm1(ruleForm1) {
                this.$refs[ruleForm1].validate((valid) => {
                    if (valid) {
                        this.$http.put("/api/admin/update/user1", this.user1).then(resp => {
                            if (resp.status == 204) {
                                this.$message.success("信息保存成功！");
                                this.loadData();
                            }
                        }).catch(error =>{});
                    } else {
                        return false;
                    }
                });
            },
            submitForm2(ruleForm2) {
                this.$refs[ruleForm2].validate((valid) => {
                    if (valid) {
                        this.$http.put("/api/admin/update/user2", this.user2).then(resp => {
                            if (resp.status == 204) {
                                this.$message.success("密码修改成功！");
                            }
                        }).catch(error =>{});;
                    } else {
                        return false;
                    }
                });
            },
            loadData() {
                this.$http.get("/api/admin/find/user/info").then(resp => {
                    this.user1.nickname = resp.data.nickname;
                    this.user1.username = resp.data.username;
                    this.user1.description = resp.data.description;
                    this.user1.phone = resp.data.phone;
                    this.user1.email = resp.data.email;
                    this.user1.id = resp.data.id;
                    this.user2.id = resp.data.id;
                    this.showUser.email = resp.data.email;
                    this.showUser.nickname = resp.data.nickname;
                    this.showUser.phone = resp.data.phone;
                    this.avatar = resp.data.avatar;
                    let days = (new Date().getTime() - new Date(resp.data.created).getTime()) / 1000 / 60 / 60 / 24;
                    this.showUser.days = Math.floor(days);
                }).catch(error =>{});
            },
            changeAvatar() {
                this.dialogVisible = false;
                this.$http.put("/api/admin/avatar", this.$qs.stringify({avatar: this.avatar})).then(resp => {
                    this.$message.success("保存成功！");
                    this.$router.push("/admin").then(() => {

                        this.$router.push("/admin/system/user/profile");
                    });
                }).catch(error =>{});
            },
        }
    }
</script>

<style scoped>
    .Breadcrumb {
        width: 100%;
        height: 48px;
        margin-bottom: 1%;
    }
</style>