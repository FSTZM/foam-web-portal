<template>
    <div>
        <div>
            <el-card class="Breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/admin/system/dashboard' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>附件</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </div>
        <div style="width: 90.2%;padding-left: 5%;margin-top: 2%">
            <el-card class="box-card" style="min-height: 1000px;background-color: #ABCDEF ">
                <div align="center">
                <span>存储位置：</span>
                <el-select v-model="upLoadData.storage" placeholder="请选择" @change="loadResposity()">
                    <el-option
                            v-for="item in storage"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <span style="margin-left: 5%">仓库名称：</span>
                <el-select v-model="upLoadData.resposity" placeholder="请选择">
                    <el-option
                            v-for="(value, key) in resposity"
                            :key="key"
                            :label="key"
                            :value="value">
                    </el-option>
                </el-select>
                <span style="margin-left: 5%">保存路径：</span>
                <el-input
                        class="inline-input"
                        v-model="upLoadData.address"
                        placeholder="格式：'admin/page'"
                        style="width: 20%"
                ></el-input>
                </div>
                <!--文件上传-->
                <div style="text-align: center;margin-top: 3%" v-show="true">
                    <el-upload
                            class="upload-demo"
                            drag="true"
                            :action="action()"
                            multiple="true"
                            :data="upLoadData"
                            :on-error="uploadError"
                            :on-success="uploadSuccess"
                            list-type="text">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip"></div>
                    </el-upload>
                </div>
                <div class="table" style="margin-top: 3%">
                    <el-button size="mini" v-show="multipleSelection.length>0" @click="handleDelete2">删除</el-button>
                    <el-table
                            :data="tableData"
                            style="width: 95%"
                            border
                            stripe
                            size="mini"
                            @selection-change="handleSelectionChange"
                            @sort-change="sortChange"
                            :default-sort="{prop: 'uploadTime', order: 'descending'}">
                        <el-table-column
                                type="selection"
                                width="35">
                        </el-table-column>
                        <el-table-column
                                label="缩略图"
                                width="120"
                                align="center">
                            <div class="demo-image_preview" slot-scope="scope">
                                <el-image
                                        style="width: 100px; height: 100px"
                                        :src="scope.row.url"
                                        :preview-src-list="[scope.row.url]">
                                </el-image>
                            </div>
                        </el-table-column>
                        <el-table-column
                                prop="uploadTime"
                                label="时间"
                                width="160"
                                align="center"
                                sortable="custom">
                            <template slot-scope="scope">
                                <i class="el-icon-time"></i>
                                <span style="margin-left: 10px">{{ scope.row.uploadTime }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="fileName"
                                label="文件名称"
                                width="180"
                                align="center"
                                sortable="custom">
                        </el-table-column>
                        <el-table-column
                                prop="address"
                                label="路径"
                                width="150"
                                align="center"
                                sortable="custom">
                        </el-table-column>
                        <el-table-column
                                prop="storage"
                                label="储存位置"
                                width="120"
                                align="center"
                                sortable="custom">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <div style="padding-bottom: 5px">
                                        <el-tag size="medium">
                                            <div>{{ loadStorage(scope.row.storage) }}</div>
                                        </el-tag>
                                    </div>
                                    <div>
                                        <el-tag size="medium">
                                            <div>{{ scope.row.bucket }}仓库</div>
                                        </el-tag>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot="header" slot-scope="scope">
                                    <el-input placeholder="根据文件名称查找,回车确认" v-model="pageInfo.search" size="mini" @keyup.enter.native="loadingTables">
                                    </el-input>
                            </template>
                            <template slot-scope="scope">
                                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                                &nbsp;
                                <el-popover
                                        placement="top-start"
                                        title="url"
                                        width="200"
                                        trigger="hover"
                                        :content="scope.row.url">
                                    <el-button slot="reference" size="mini" type="success" class="tag"
                                               @click="copy(scope.row.url)">url
                                    </el-button>
                                </el-popover>
                                &nbsp;
                                <el-popover
                                        placement="top-start"
                                        title="MarkDown"
                                        width="200"
                                        trigger="hover"
                                        :content="scope.row.showUrl">
                                    <el-button slot="reference" size="mini" type="success" class="tag"
                                               @click="copy(scope.row.showUrl)">MarkDown
                                    </el-button>
                                </el-popover>
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
    import Clipboard from 'clipboard';

    export default {
        name: "system-attachments",
        beforeCreate() {
        },
        created() {
            this.loadingTables();
        },
        data() {
            return {
                dialogVisible: false,
                totalElements: "",
                pageSizes: [5, 10, 15, 20],
                pageInfo: {
                    total: "",
                    pageSize: "10",
                    currentPage: "1",
                    order: "",
                    prop: "",
                    search: ""
                },
                upLoadData: {
                    address: "",
                    storage: "",
                    resposity: ""
                },
                resposity: {},
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
                value: '',
                tableData: [],
                multipleSelection: []
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
            sortChange(column) {
                this.pageInfo.order = column.order;
                this.pageInfo.prop = column.prop;
                this.loadingTables();
            },
            handleDelete(id) {
                this.$confirm('是否删除该文件？(无法复原)',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete("/api/file/info/delete/" + id).then(resp => {
                        if (resp.status == 204) {
                            this.$message.success("删除成功");
                            this.loadingTables();
                        } else {
                            this.$message.error("删除失败！");
                        }
                    }).catch(error=>{});
                }).catch(() => {
                });
            },
            handleDelete2() {
                this.$confirm('是否删除所有选中文件？(无法复原)',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete("/api/file/info/delete/ids",{data:this.multipleSelection}).then(resp => {
                        if (resp.status == 204) {
                            this.$message.success("删除成功");
                            this.loadingTables();
                        } else {
                            this.$message.error("删除失败！");
                        }
                    }).catch(error=>{});
                }).catch(() => {
                });
            },
            loadResposity() {
                if (this.upLoadData.storage == 1) {
                    this.$http.get("/api/file/aliyun/resposity").then(resp => {
                        this.resposity = resp.data;
                    }).catch(error=>{});

                }
            },
            action() {

                if (this.upLoadData.storage == 1) {
                    return "/api/file/aliyun/upload";
                }
            },
            uploadError() {
                if (this.upLoadData.storage == "") {
                    this.$message.warning("请先指定上传文件的目标储存位置和仓库！");
                } else if (this.upLoadData.resposity == "") {

                    this.$message.warning("请先指定上传文件的目标仓库！");

                } else {

                    this.$message.error("上传失败发生未知错误！")
                }

            },
            uploadSuccess() {
                this.$message.success("文件上传成功！");
                this.loadingTables();
            },
            loadingTables() {
                this.$http.get("/api/file/info/find", {
                    params: {
                        currentPage: this.pageInfo.currentPage, // 当前页
                        pageSize: this.pageInfo.pageSize, // 每页条数
                        prop: this.pageInfo.prop, // 排序字段
                        order: this.pageInfo.order, // 是否降序
                        search: this.pageInfo.search // 查询字段
                    }
                }).then(resp => {

                    this.tableData = resp.data.content;
                    this.totalElements = resp.data.totalElements;
                }).catch(error=>{});

            },
            loadStorage(storage) {
                if (storage == 1) {
                    return "阿里云";

                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            copy(text) {
                let clipboard = new Clipboard('.tag', {
                    text: function () {
                        return text
                    }
                })
                clipboard.on('success', e => {
                    this.$message({message: '复制成功', showClose: true, type: 'success'})
                    // 释放内存
                    clipboard.destroy()
                })
                clipboard.on('error', e => {
                    this.$message({message: '复制失败,', showClose: true, type: 'error'})
                    clipboard.destroy()
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

    .table {
        padding-left: 5%;
    }
</style>