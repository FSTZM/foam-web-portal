<template>
    <div>
        <div>
            <el-card class="Breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/admin/system/dashboard' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>文章</el-breadcrumb-item>
                    <el-breadcrumb-item>所有文章</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </div>
        <div style="margin-top: 2%;margin-left: 5%;margin-right: 5%">
            <el-card align="center">
                <div>
                    <span style="margin-right: 1%">标题:</span><span style="margin-right: 4%"><el-input
                        v-model="pageInfo.title" placeholder="请输入标题关键字" style="width: 15%"
                        size="medium"></el-input></span>
                    <span style="margin-right: 1%">文章状态:</span>
                    <span style="margin-right: 4%">
                        <el-select v-model="pageInfo.state" placeholder="请选择" size="medium" style="width: 15%"
                                   clearable>
                            <el-option
                                    v-for="item in options3"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </span>
                    <span style="margin-right: 1%">分类:</span>
                    <span style="margin-right: 4%">
                        <el-cascader
                                :options="options"
                                :props="props"
                                v-model="pageInfo.category"
                                :show-all-levels="false"
                                clearable
                                size="medium"
                                style="width: 15%">
                        </el-cascader>
                    </span>
                    <span style="padding-right: 1%"><el-button type="primary" size="medium"
                                                               @click="loadPostTable">查询</el-button></span>
                    <span><el-button size="medium" @click="pageInfo.title = '';pageInfo.state = '';pageInfo.category = '';">重置</el-button></span>
                </div>
                <div class="table" style="margin-top: 3%">
                    <div align="left" style="margin-left: 25px">
                        <span>
                            <el-button size="mini" v-if="multipleSelection.length>0" v-show="selectedButton" @click="recover2">回收站</el-button>
                        </span>
                        <span>
                            <el-button size="mini" v-if="multipleSelection.length>0" v-show="!selectedButton" @click="deletePost2">删除</el-button>
                            <el-button size="mini" v-if="multipleSelection.length>0" v-show="!selectedButton" @click="recover3">还原</el-button>
                        </span>
                    </div>
                    <el-table
                            :data="tableData"
                            style="width: 95%;font-size: 14px"
                            stripe
                            size="mini"
                            @selection-change="handleSelectionChange"
                            @sort-change="sortChange"
                            :default-sort="{prop: 'date', order: 'descending'}">
                        <el-table-column
                                type="selection"
                                width="40">
                        </el-table-column>
                        <el-table-column
                                prop="date"
                                label="时间"
                                width="160"
                                align="center"
                                sortable="custom">
                        </el-table-column>
                        <el-table-column label="标题" align="center" width="150">
                            <template slot-scope="scope">
                                <a href="#" v-text="scope.row.fileTitle" @click.prevent="showPost(scope.row.id)"></a>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" align="center" width="80" sortable="custom" prop="state">
                            <template slot-scope="scope">
                                <span v-if="scope.row.state==1"><el-badge is-dot class="item" type="warning"></el-badge>草稿</span>
                                <span v-if="scope.row.state==2"><el-badge is-dot class="item" type="success"></el-badge>已发布</span>
                                <span v-if="scope.row.state==3"><el-badge is-dot class="item"></el-badge>回收站</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="分类"
                                width="150"
                                prop="category"
                                align="center">
                        </el-table-column>
                        <el-table-column label="标签" align="center">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.tag1 != null" style="margin: 1%">{{scope.row.tag1}}</el-tag>
                                <el-tag v-if="scope.row.tag2 != null" style="margin: 1%">{{scope.row.tag2}}</el-tag>
                                <el-tag v-if="scope.row.tag3 != null" style="margin: 1%">{{scope.row.tag3}}</el-tag>
                                <el-tag v-if="scope.row.tag4 != null" style="margin: 1%">{{scope.row.tag4}}</el-tag>
                                <el-tag v-if="scope.row.tag5 != null" style="margin: 1%">{{scope.row.tag5}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="评论" align="center" width="80" prop="commentNum" sortable="custom">
                            <template slot-scope="scope">
                                <el-badge :value="scope.row.commentNum" class="item"></el-badge>
                            </template>
                        </el-table-column>
                        <el-table-column label="访问" align="center" width="80" sortable="custom" prop="accessNum">
                            <template slot-scope="scope">
                                <el-badge :value="scope.row.accessNum" class="item" type="primary"></el-badge>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <div v-if="scope.row.state == 3">
                                    <a href="javascript:void(0)" @click="handleClose(scope.row.id,1,scope.row.fileTitle)">还原</a>&nbsp;|
                                    <a href="javascript:void(0)" @click="deletePost(scope.row.id,scope.row.fileTitle)">删除</a>&nbsp;|
                                    <a href="javascript:void(0)" @click="saveStart(scope.row.id)">设置</a>
                                </div>
                                <div v-else>
                                    <a href="javascript:void(0)" @click="editPost(scope.row.id)">编辑</a>&nbsp;|
                                    <a href="javascript:void(0)" @click="handleClose(scope.row.id,3,scope.row.fileTitle)">回收站</a>&nbsp;|
                                    <a href="javascript:void(0)" @click="saveStart(scope.row.id)">设置</a>
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
                    <!--抽屉-->
                    <div style="font-size: 17px">
                        <el-drawer
                                title="文章设置"
                                :visible.sync="drawer"
                                direction="rtl"
                                size="30%"
                                style="height: 100%">
                            <div style="margin-top: -10%;padding-left: 5%;height: 70%;overflow-y: auto;max-height: 800px">
                                <el-divider></el-divider>
                                <div style="font-size: 15px;color: #606266">
                                    <div style="font-size: 18px;font-weight:600;margin-bottom: 3%">基本设置</div>
                                    <div style="margin-bottom: 3%">发表时间：</div>
                                    <div class="block">
                                        <el-date-picker
                                                :editable="false"
                                                v-model="editorData.date"
                                                type="datetime"
                                                placeholder="选择文章发表时间"
                                                align="right"
                                                :picker-options="pickerOptions"
                                                size="small"
                                                :default-value="new Date()"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                style="width: 90%;margin-bottom: 5%">
                                        </el-date-picker>
                                    </div>
                                    <div style="margin-bottom: 3%">开启评论：</div>
                                    <div style="margin-bottom: 5%">
                                        <el-radio v-model="editorData.comment" label="1">是</el-radio>
                                        <el-radio v-model="editorData.comment" label="2">否</el-radio>
                                    </div>
                                    <div style="margin-bottom: 3%">是否置顶：</div>
                                    <div style="margin-bottom: 5%">
                                        <el-radio v-model="editorData.top" label="1">是</el-radio>
                                        <el-radio v-model="editorData.top" label="2">否</el-radio>
                                    </div>
                                    <el-divider></el-divider>
                                    <div style="margin-bottom: 3%">选择分类：</div>
                                    <div style="margin-bottom: 3%">
                                        <el-cascader
                                                :options="options"
                                                :props="props"
                                                v-model="editorData.category"
                                                :show-all-levels="false"
                                                clearable size="mini"></el-cascader>
                                    </div>
                                    <div><el-button size="mini" v-show="show" @click="show = false">新增</el-button></div>
                                    <div>
                                        <div slot="header">
                                        </div>
                                        <div v-show="!show">
                                            <el-card style="width: 65%">
                                                <el-form label-position="top" label-width="80px" :model="postCategory" size="mini"
                                                         status-icon
                                                         :rules="rules" ref="ruleForm">
                                                    <el-form-item label="分类名称：" prop="categoryName">
                                                        <el-input v-model="postCategory.categoryName" style="width: 185px"></el-input>
                                                    </el-form-item>
                                                    <el-form-item label="上级目录：">
                                                        <el-cascader
                                                                :options="options"
                                                                :props="props"
                                                                v-model="postCategory.parentId"
                                                                :show-all-levels="false"
                                                                clearable></el-cascader>
                                                    </el-form-item>
                                                    <el-form-item>
                                                        <el-button type="primary" size="small" @click="saveForm('ruleForm')">保存</el-button>
                                                        <el-button size="small" @click="show=true">取消</el-button>
                                                    </el-form-item>
                                                </el-form>
                                            </el-card>
                                        </div>
                                    </div>
                                    <el-divider></el-divider>
                                    <div style="margin-bottom: 3%">选择标签：</div>
                                    <div style="margin-bottom: 5%">
                                        <div style="margin-bottom: 3%">
                                            <el-select v-model="editorData.tags" multiple placeholder="请选择" size="mini" multiple-limit="5">
                                                <el-option
                                                        v-for="tag in options2"
                                                        :key="tag.id"
                                                        :label="tag.tagName"
                                                        :value="tag.id">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div><el-button size="mini" v-show="show2" @click="show2 = false">新增</el-button></div>
                                        <div v-show="!show2">
                                            <el-card style="width: 65%">
                                                <el-form label-position="top" label-width="80px" :model="postTag" size="mini"
                                                         status-icon
                                                         :rules="rules2" ref="ruleForm2">
                                                    <el-form-item label="标签名称：" prop="tagName">
                                                        <el-input v-model="postTag.tagName"></el-input>
                                                    </el-form-item>
                                                    <el-form-item>
                                                        <el-button type="primary" size="small" @click="saveForm2('ruleForm2')">保存</el-button>
                                                        <el-button size="small" @click="show2=true">取消</el-button>
                                                    </el-form-item>
                                                </el-form>
                                            </el-card>
                                        </div>
                                    </div>
                                    <el-divider></el-divider>
                                    <div style="margin-bottom: 3%;">摘要</div>
                                    <div style="margin-bottom: 5%">
                                        <el-input
                                                type="textarea"
                                                :rows="4"
                                                placeholder="请输入内容"
                                                v-model="editorData.description"
                                                style="width: 90%">
                                        </el-input>
                                    </div>
                                    <el-divider></el-divider>
                                    <div style="margin-bottom: 3%">缩略图url</div>
                                    <div>
                                        <div style="margin-bottom: 3%;width: 90%">
                                            <el-input placeholder="请输入图片url" v-model="editorData.imgUrl" class="input-with-select"
                                                      size="mini">
                                            </el-input>
                                        </div>
                                        <div style="margin-bottom: 3%">
                                            <el-button slot="append" size="mini" type="primary" @click="loadingUpload">附件库
                                            </el-button>
                                            <el-drawer
                                                    :append-to-body="true"
                                                    :visible.sync="innerDrawer"
                                                    direction="ltr"
                                                    size="94%"
                                                    :show-close="false">
                                                <div style="margin-top: -8%;height: 70%;overflow-y: auto;max-height: 1100px;overflow-x:hidden">
                                                    <router-view></router-view>
                                                </div>
                                            </el-drawer>
                                        </div>
                                    </div>
                                    <div class="demo-image__preview">
                                        <el-image
                                                style="width: 200px; height: 200px"
                                                :src="editorData.imgUrl">
                                        </el-image>
                                    </div>
                                    <div style="position: fixed;width: 30%;height: 7%;background-color: #F2F6FC;bottom: 0px;z-index: 5;vertical-align: middle;margin-left: -1.5%;border-top:1px solid #cacaca;">
                                        <div style="vertical-align: middle;padding-right: 5%;padding-top: 2%" align="right">
                                            <el-button size="small" style="color: crimson" @click="saveAndDraft()">保存草稿</el-button>
                                            <el-button size="small" type="primary" @click="saveAndPubilsh">发布</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-drawer>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "system-posts-list",
        created() {
            this.loadPostTable();
            this.loadingOptions();
        },
        data() {
            return {
                dialogVisible: false,
                options3: [{
                    value: '1',
                    label: '草稿'
                }, {
                    value: '2',
                    label: '已发布'
                }, {
                    value: '3',
                    label: '回收站'
                }],
                options2: [],//标签
                props: {
                    checkStrictly: true,
                    label: 'categoryName',
                    value: 'id',
                    children: 'children'
                },
                totalElements: "",
                pageSizes: [5, 10, 15, 20],
                pageInfo: {
                    total: "",
                    pageSize: "10",
                    currentPage: "1",
                    order: "",
                    prop: "",
                    title: "",
                    state: "",
                    category: []
                },
                tableData: [],
                multipleSelection: [],

                postTag: {
                    id: "",
                    tagName: "",
                    description: ""
                },
                show:true,
                show2:true,
                postCategory: {
                    id: "",
                    categoryName: "",
                    parentId: [],
                    description: ""
                },
                options: [],//分类信息
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
                },
                rules2: {
                    tagName: [
                        {required: true, message: "标签名称不能为空", trigger: "blur"},
                        {
                            min: 0,
                            max: 20,
                            message: "标签名称长度不能超过20",
                            trigger: "blur"
                        }
                    ]
                },
                drawer: false,
                innerDrawer: false,
                editorData: {
                    id:"",
                    resposity: "",
                    storage: "",
                    fileTitle: "",
                    html: "",
                    markDown: "",
                    date: "",
                    comment: "1",
                    top: "1",
                    category: [],
                    tags: [],
                    description: "",
                    imgUrl: "",
                    state: "1"
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                selectedButton:true
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.selectedButton = true;
                this.multipleSelection = val;
                let states = [];
                this.multipleSelection.forEach(post=>{
                    states.push(post.state);
                })
                if (!states.includes(1) && !states.includes(2)){
                    this.selectedButton = false;
                }
            },
            handleSizeChange(val) {
                this.pageInfo.pageSize = val;
                this.loadPostTable();
            },
            handleCurrentChange(val) {
                this.pageInfo.currentPage = val;
                this.loadPostTable();
            },
            loadPostTable() {
                this.$http.get("/api/post/find/all/factor", {
                    params: {
                        currentPage: this.pageInfo.currentPage, // 当前页
                        pageSize: this.pageInfo.pageSize, // 每页条数
                        prop: this.pageInfo.prop, // 排序字段
                        order: this.pageInfo.order, // 是否降序
                        title: this.pageInfo.title,
                        state: this.pageInfo.state,
                        category: this.$qs.stringify(this.pageInfo.category)
                    }
                }).then(resp => {

                    this.tableData = resp.data.content;
                    this.totalElements = resp.data.totalElements;
                }).catch(error =>{});
            },
            recover(id,targetState) {
                this.$http.put("/api/post/recover", this.$qs.stringify({id: id,targetState: targetState})).then(resp => {
                    this.loadPostTable();

                }).catch(() => {
                        this.$message.error("操作失败！");
                    this.loadPostTable();
                    }
                )
            },
            recover2() {
                this.$http.put("/api/post/recover/selected", this.multipleSelection).then(resp => {
                    this.loadPostTable();

                }).catch(() => {
                        this.$message.error("操作失败！");
                        this.loadPostTable();
                    }
                )
            },
            recover3() {
                this.$http.put("/api/post/recover/selected2", this.multipleSelection).then(resp => {
                    this.loadPostTable();
                }).catch(() => {
                        this.$message.error("操作失败！");
                        this.loadPostTable();
                    }
                )
            },
            handleClose(id,targetState,title) {
                if (targetState == 3){
                    this.$confirm('确认要将文章【'+title+'】放入回收站？',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.recover(id,targetState);
                    }).catch(() => {
                    });
                }else if(targetState == 1) {
                    this.$confirm('确认将文章【'+title+'】还原为草稿？',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.recover(id,targetState);
                    }).catch(() => {
                    });
                }
            },
            deletePost(id,title){
                this.$confirm('是否将文章【'+title+'】永久删除？(无法复原)',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete("/api/post/delete/post",{params: {id: id}}).then(resp => {
                        this.$message.success("删除成功！");
                        this.loadPostTable();
                    }).catch(error => {
                        this.$message.error("删除失败！");
                        this.loadPostTable();
                    });
                }).catch(() => {
                });
            },
            deletePost2(){

                this.$confirm('是否删除所有选中文章？(无法复原)',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete("/api/post/delete/post/selected",{data: this.multipleSelection}).then(resp => {
                        this.$message.success("删除成功！");
                        this.loadPostTable();
                    }).catch(error => {
                        this.$message.error("删除失败！");
                        this.loadPostTable();
                    });
                }).catch(() => {
                });
            },
            sortChange(obj){
                this.pageInfo.prop = obj.prop;
                this.pageInfo.order = obj.order;
                this.loadPostTable();
            },

            loadingUpload() {
                this.innerDrawer = true;
                this.$router.push("/admin/system/posts/write/attachments");
            },
            savePost() {
                this.$http.put("/api/post/update/post", this.editorData).then(resp => {
                    this.$message.success("保存成功！");
                    this.loadPostTable();
                    this.drawer=false;
                }).catch(error => {
                    this.$message.success("修改失败！");
                })
            },
            saveAndDraft(){
                this.editorData.state = "1";
                this.savePost();
            },
            saveAndPubilsh() {
                this.editorData.state = "2";
                this.savePost();
            },
            loadingOptions() {
                this.$http.get("/api/post/find/category/options").then(resp => {
                    this.options = resp.data;
                }).catch(error => {
                    this.$message.error("分类数据加载失败！");
                });
            },
            saveForm(ruleForm) {
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        this.$http.post("/api/post/save/category", this.postCategory).then(resp => {
                            if (resp.status == 201) {
                                this.$message.success("分类保存成功！");
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
            saveStart(id){
                this.loadPostData(id);
                this.drawer = true;
                this.loadTagData();
            },
            saveForm2(ruleForm2) {
                this.$refs[ruleForm2].validate((valid) => {
                    if (valid) {
                        this.$http.post("/api/post/save/tag", this.postTag).then(resp => {
                            if (resp.status == 201) {
                                this.$message.success("标签保存成功！");
                                this.loadTagData();
                                this.postTag = {
                                    id: "",
                                    tagName: "",
                                    description: ""
                                }
                                this.show2 = true;
                            }
                        }).catch(error =>{});
                    } else {
                        return false;
                    }
                });
            },
            loadTagData() {
                this.$http.get("/api/post/find/tag").then(resp => {
                    this.options2 = resp.data;
                }).catch(error => {
                    this.$message.error("标签数据查询失败！");
                });
            },
            loadPostData(id){
                this.$http.get("/api/post/find/"+id).then(resp => {
                    this.editorData.id = resp.data.id;
                    this.editorData.resposity = resp.data.resposity;
                    this.editorData.storage = resp.data.storage;
                    this.editorData.fileTitle = resp.data.fileTitle;
                    this.editorData.html = resp.data.html;
                    this.editorData.markDown = resp.data.markDown;
                    this.editorData.date = resp.data.date;
                    this.editorData.comment = resp.data.comment;
                    this.editorData.top = resp.data.top;
                    this.editorData.category = resp.data.category;
                    this.editorData.tags = resp.data.tags;
                    this.editorData.description = resp.data.description;
                    this.editorData.imgUrl = resp.data.imgUrl;
                    this.editorData.state = resp.data.state;
                    console.log(this.editorData.category);
                }).catch(error => {
                    this.$message.error("数据查询失败！");
                });
            },
            editPost(id){
                this.$router.push({name:'postsWrite',query: {id: id}});
            },
            showPost(id){
                this.$router.push({name:'indexPost',query: {id: id}});
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