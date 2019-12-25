<template>
    <div class="style" align="center" v-if="userExist == 0">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>博主信息注册</span>
            </div>
            <div class="text item">
                <el-form
                        :model="user"
                        status-icon
                        :rules="rules"
                        ref="registerForm"
                        label-width="80px"
                        class="registerForm"
                >
                    <el-form-item label="用户名" prop="username">
                        <el-input
                                v-model="user.username"
                                placeholder="请输入用户名,长度为2到30个英文字母或数字"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="nickname">
                        <el-input
                                v-model="user.nickname"
                                placeholder="请输入用户昵称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input
                                type="password"
                                v-model="user.password"
                                autocomplete="off"
                                placeholder="请输入密码"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="password2">
                        <el-input
                                type="password"
                                v-model="user.password2"
                                autocomplete="off"
                                placeholder="请再次输入密码"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="register('registerForm')" style="width: 100%"
                        >注册
                        </el-button
                        >
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
    <div class="style" align="center" v-else-if="userExist == 1">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>用户登录</span>
            </div>
            <div class="text item">
                <el-form
                        :model="user"
                        status-icon
                        :rules="rules2"
                        ref="loginForm"
                        label-width="80px"
                        class="loginForm"
                >
                    <el-form-item label="用户名" prop="username">
                        <el-input
                                v-model="user.username"
                                placeholder="请输入用户名"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input
                                type="password"
                                v-model="user.password"
                                autocomplete="off"
                                placeholder="请输入密码"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="login('loginForm')" style="width: 100%">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "admin",
        beforeCreate() {
            document.querySelector('body').setAttribute('style', 'background-color: #F0F2F5')
        },
        created() {
            this.check();
            if (this.userExist == 0){
                document.title = "登录";
            } else {
                document.title = "注册";
            }

        },
        beforeDestroy() {
            document.querySelector('body').setAttribute('style', 'background-color: #F0F2F5')
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
                if (value !== this.user.password) {
                    callback(new Error("两次输入密码不一致!"));
                } else {
                    callback();
                }
            };

            return {
                userExist: "",
                user: {
                    username: "",
                    nickname: "",
                    password: "",
                    password2: ""
                },
                rules: {
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
                rules2: {
                    /*            username: [
                                    { required: true, message: "用户名不能为空", trigger: "blur" }
                                ],
                                password: [
                                    { required: true, message: "密码不能为空", trigger: "blur" },
                                    {
                                        min: 6,
                                        max: 20,
                                        message: "密码长度必须在6-20字符之间",
                                        trigger: "blur"
                                    }
                                ]*/
                }
            };
        },
        methods: {
            register(registerForm) {
                this.$refs[registerForm].validate((valid) => {
                    if (valid) {
                        let user = this.user;
                        delete user.password2;
                        this.$http.post("/api/admin/register", this.user).then(resp => {
                            //注册成功
                            // 获取响应结果对象
                            if (resp.status === 201) {
                                // 注册成功
                                this.$message({
                                    message: "账号注册成功,即将跳转至登录页面！",
                                    type: "success"
                                });
                                setTimeout(() => this.userExist = true, 2000);
                            }
                        }).catch(error => {
                            this.$message({
                                message: "账号注册失败！",
                                type: "error"
                            });
                        });

                    } else {
                        console.log('所填注册信息不符合要求!');
                        return false;
                    }
                });
            },
            check() {
                this.$http.get("/api/admin/check").then(resp => {
                    // 获取响应结果对象
                    if (resp.data == 1) {
                        this.userExist = 1;
                    } else {
                        this.userExist = 0;
                    }
                }).catch(error =>{});
            },
            login(loginForm) {
                this.$refs[loginForm].validate((valid) => {
                    if (valid) {
                        let lastUser = new Object();
                        lastUser.username = this.user.username;
                        lastUser.password = this.user.password;
                        this.$http.post("/api/admin/login", lastUser).then(resp => {
                            let token = resp.headers.token;
                            localStorage.setItem("token",token);
                            //登录成功
                            // 获取响应结果对象
                            this.$router.push('/admin/system');
                        }).catch(error=>{})
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both;
    }

    .box-card {
        width: 480px;
    }

    .clearfix {
        text-align: center;
    }

    .style {
        padding-top: 8%;
    }
</style>
