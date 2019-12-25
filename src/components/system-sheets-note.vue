<template>
    <div align="center">
        <div>
            <el-card class="Breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/admin/system/dashboard' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>页面</el-breadcrumb-item>
                    <el-breadcrumb-item>便签</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </div>
            <el-card style="width: 90%" class="board">
                    <span v-for="note in notes" style="float: left;margin-left: 25px;margin-bottom: 20px;">
                         <el-card class="box-card" shadow="hover" align="left">
                             <span slot="header" class="clearfix">
                                 <span v-text="note.createTime"></span>
                                    <el-button style="float: right; padding: 3px 0" type="text" @click="deleteNote(note.id)">删除</el-button>
                                    <el-button style="float: right; padding: 3px 0" type="text" @click="editStart(note.id)">编辑</el-button>
                                </span>
                             <span class="text item" v-text="note.content"></span>
                         </el-card>
                    </span>
                    <el-dialog
                            :title="edit.createTime"
                            :visible.sync="showEdit"
                            width="35%"
                            top="25vh">
                        <el-input
                                type="textarea"
                                :rows="7"
                                placeholder="写点什么吧..."
                                v-model="edit.content">
                        </el-input>
                        <el-button type="primary" size="small" style="margin-top: 10px" @click="saveNote">保存</el-button>
                        <el-button type="primary" size="small" style="margin-top: 10px" @click="canelNote">取消</el-button>
                    </el-dialog>
            </el-card>
    </div>
</template>

<script>
    export default {
        name: "system-sheets-note",
        created(){
            this.loadNotes();
        },
        data() {
            return {
                notes:[],
                showEdit:false,
                edit:{
                }
            }
        },
        methods:{
            loadNotes(){
                this.$http.get("/api/dashboard/find/note").then(resp=>{
                    this.notes = resp.data;
                }).catch(error =>{});
            },
            deleteNote(id){
                this.$http.delete("/api/dashboard/delete/note",{params:{
                    id: id
                    }}).then(resp =>{
                        this.loadNotes();
                        this.$message.success("删除成功！");
                    }).catch(error => {
                    this.$message.error("删除失败！");
                })
            },
            editStart(id){
                this.$http.get("/api/dashboard/find/note/"+id).then(resp=>{
                    this.edit = resp.data;
                    this.showEdit = true;
                }).catch(error =>{});
            },
            canelNote(){
                this.showEdit = false;
                this.edit = {};
                this.loadNotes();
            },
            saveNote(){
                this.$http.put("/api/dashboard/update/note",this.edit).then(resp=>{

                    this.$message.success("修改成功！")
                    this.note = {
                        id:"",
                        createTime:"",
                        content:"",
                        updateTime:""
                    }
                    this.showEdit = false;
                    this.edit = {};
                    this.loadNotes();
                }).catch(error =>{
                    this.$message.error("修改失败！")
                })
            }
        }
    }
</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .box-card {
        width: 350px;
        min-height: 200px;
    }

    .Breadcrumb {
        width: 100%;
        height: 48px;
        margin-bottom: 1%;
    }

    .board {
        background-color: #ed6a43;
        min-height: 800px;
    }
</style>