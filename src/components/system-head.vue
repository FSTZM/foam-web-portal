<template>
    <header class="systemHead" :style="'background:' + headBackgroundColor">
        <el-row>
            <el-col :span="3">
                <div style="font-weight: 600;font-size: 16px;margin-top: 22px" align="center">Foam Dashboard</div>
            </el-col>
            <el-col :span='18'>
                <el-menu
                        class="el-menu-demo"
                        mode="horizontal"
                        :background-color= headBackgroundColor
                        text-color="#CECECE"
                        active-text-color="#ffd04b">
                    <el-menu-item index="1" @click="toNextPage('dashboard')">仪表盘</el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">文章</template>
                        <el-menu-item index="2-1" @click="toNextPage('posts/list')">所有文章</el-menu-item>
                        <el-menu-item index="2-2" @click="toNextPage('posts/write')">写文章</el-menu-item>
                        <el-menu-item index="2-3" @click="toNextPage('posts/categories')">分类目录</el-menu-item>
                        <el-menu-item index="2-4" @click="toNextPage('posts/tags')">标签</el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title">页面</template>
                        <!--<el-menu-item index="3-1">所有页面</el-menu-item>-->
                        <el-menu-item index="3-2" @click="toNextPage('sheets/notes')">便签</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="4" @click="toNextPage('attachments')">附件</el-menu-item>
                    <el-menu-item index="5" @click="toNextPage('comment')">评论</el-menu-item>
<!--                    <el-submenu index="6">
                        <template slot="title">外观</template>
                        <el-menu-item index="6-1">主题</el-menu-item>
                        <el-menu-item index="6-2">菜单</el-menu-item>
                        <el-menu-item index="6-3">主题编辑</el-menu-item>
                    </el-submenu>-->
                    <el-submenu index="7">
                        <template slot="title">用户</template>
                        <el-menu-item index="7-1" @click="toNextPage('user/profile')">个人资料</el-menu-item>
                        <el-menu-item index="7-2" @click="toNextPage('about')">关于我</el-menu-item>
                    </el-submenu>
                    <el-submenu index="8">
                        <template slot="title">系统设置</template>
                        <el-menu-item index="8-1" @click="toNextPage('options')">博客设置</el-menu-item>
                        <!--<el-menu-item index="8-2">小工具</el-menu-item>-->
                    </el-submenu>
                </el-menu>
            </el-col>
            <el-col :span="3">
                <el-menu
                        class="el-menu-demo"
                        mode="horizontal"
                        :background-color= headBackgroundColor
                        text-color="#fff"
                        active-text-color="#ffd04b">
                        <el-tooltip class="item" effect="dark" content="点击回到博客主页" placement="bottom">
                    <el-menu-item class="toIndex" @click="toIndex">
                            <i class="el-icon-link"></i>
                    </el-menu-item>
                        </el-tooltip>
                    <el-menu-item class="user">
                        <el-dropdown class="dropdownMenu" placement="bottom-start">
                      <span class="el-dropdown-link">
                        <div class="demo-basic--circle">
                            <div class="block">
                                <el-avatar :size="size" :src="avatar"></el-avatar>
                            </div>
                        </div>
                      </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item><div @click="toNextPage('user/profile')">个人资料</div></el-dropdown-item>
                                <el-dropdown-item><div @click="logout">退出登录</div></el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </header>
</template>
<script>
    export default {
        name: "systemHead",
        beforeCreate() {
        },
        created() {
            this.$http.get("/api/admin/find/user/info").then(resp => {
                this.avatar = resp.data.avatar;
            }).catch(error =>{});
        },
        data() {
            return {
                headBackgroundColor: "#001529",
                avatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
                squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
                size: "small"
            }
        },
        methods: {
            toNextPage(path) {
                this.$router.push("/admin/system/" + path);
            },
            toIndex() {
                this.$router.push({name:'indexIndex'});
            },
            logout(){
/*                this.$http.post("/api/admin/logout").then(resp =>{
                    this.$message.success("退出登录成功！");
                    this.$router.push("/admin");
                }).catch(error =>{
                    this.$message.error("退出登录失败！")
                })*/
                this.$router.push("/admin");
                this.$message.success("退出登录成功！");
                localStorage.removeItem("token");
            }
        }
    };
</script>

<style scoped>
    .systemHead {
        width: 100%;
        height: 60px;
        min-width: 600px;
        color: #fff;
    }

    .title {
        padding-top: 20px;
    }

    .dropdownMenu {
        padding-top: 1%;
    }

    .toIndex {
        padding: 0px 0px;
    }
</style>
