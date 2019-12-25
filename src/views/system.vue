<template>
<div class="system">
    <systemHead></systemHead>
    <router-view></router-view>
    <el-footer class="text" style="margin-top: 5%"><div class="text">Proudly power by Foam</div></el-footer>
</div>
</template>

<script>
    import systemHead from "../components/system-head.vue";
    export default {
        name: "system",
        components: {
            systemHead
        },
        beforeCreate() {
            document.querySelector('body').setAttribute('style', 'background-color: #F0F2F5')
        },
        created() {
            document.title = "博客后台管理";
        },
        beforeDestroy() {
            document.querySelector('body').setAttribute('style', 'background-color: #F0F2F5')
        },
    }
</script>

<style scoped>

    .text {
        text-align: center;
        vertical-align: middle;
    }

    .system {
        background-color: #F0F2F5;
    }
</style>