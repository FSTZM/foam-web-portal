<template>
    <div class="post">
        <div>
            <el-card class="Breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/admin/system/dashboard' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>文章</el-breadcrumb-item>
                    <el-breadcrumb-item>写文章</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </div>
        <div align="center">
            <el-input
                    type="text"
                    placeholder="请输入文章标题"
                    v-model="editorData.fileTitle"
                    style="width: 90%;margin-top: 1%">
            </el-input>
        </div>
        <div>
            <mavon-editor
                    ref=md
                    :ishljs="true"
                    @imgAdd="$imgAdd"
                    @imgDel="$imgDel"
                    @change="editor"
                    boxShadowStyle="0 2px 12px 0 rgba(0, 0, 0, 0.1)"
                    :toolbars="toolbars"
                    style="width: 90%;height:600px;margin-left: 5%;margin-top: 1%;z-index: 0"
                    placeholder="写点什么吧..."
                    v-model="post"
            />
        </div>
        <div style="position: fixed;width: 100%;height: 7%;background-color: ghostwhite;bottom: 0px;z-index: 5;vertical-align: middle">
            <div style="vertical-align: middle;padding-right: 2%;padding-top: 0.4%;border-top:1px solid #cacaca;"
                 align="right">
                <el-button size="small" type="primary" @click="saveStart">保存</el-button>
                <el-button size="small" style="color: black" @click="loadingUpload">附件库</el-button>
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
                        <div style="margin-bottom: 3%">
                            <div style="font-size: 18px;font-weight:600;margin-bottom: 3%">图片设置</div>
                            <div style="margin-top: 4%;margin-bottom: 3%">
                                <span>存储位置：</span>
                                <span style="margin-left: 30%">仓库名称：</span>
                            </div>
                            <el-select v-model="editorData.storage" placeholder="请选择" @change="loadResposity()"
                                       size="mini" style="width: 40%">
                                <el-option
                                        v-for="item in storage"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="editorData.resposity" placeholder="请选择" size="mini"
                                       style="margin-left:10%;width: 40%">
                                <el-option
                                        v-for="(value, key) in resposity"
                                        :key="key"
                                        :label="key"
                                        :value="value">
                                </el-option>
                            </el-select>
                        </div>
                        <div>
                            <el-button type="primary" size="mini" style="margin-bottom: 5%" @click="uploading">上传图片
                            </el-button>
                        </div>
                        <el-divider></el-divider>
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
                                <el-button size="small" style="color: crimson" @click="saveAndDraft">保存草稿</el-button>
                                <el-button size="small" type="primary" @click="saveAndPubilsh">发布</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </el-drawer>
        </div>
    </div>
</template>

<script>
    export default {
        name: "system-posts-write",
        created(){
            const id = this.$route.query.id;
            if (id != undefined){
                this.$http.get("/api/post/find/"+id).then(resp => {
                    this.editorData.id = resp.data.id;
                    this.editorData.resposity = resp.data.resposity;
                    this.editorData.storage = resp.data.storage;
                    this.editorData.fileTitle = resp.data.fileTitle;
                    //this.editorData.html = resp.data.html;
                    this.post = resp.data.markDown;
                    this.editorData.date = resp.data.date;
                    this.editorData.comment = resp.data.comment;
                    this.editorData.top = resp.data.top;
                    this.editorData.category = resp.data.category;
                    this.editorData.tags = resp.data.tags;
                    this.editorData.description = resp.data.description;
                    this.editorData.imgUrl = resp.data.imgUrl;
                    this.editorData.state = resp.data.state;
                }).catch(error => {
                    this.$message.error("数据查询失败！");
                });
            }
        },
        data() {
            return {
                post:"",//文章回显
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
                options: [],
                options2: [],
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
                imgIsUpload: "1",
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
                drawer: false,
                innerDrawer: false,
                img_file: {},
                editorData: {
                    id:"",
                    resposity: "",
                    storage: "",
                    fileTitle: "",
                    html: "",
                    markDown: "",
                    date: "",
                    comment: "2",
                    top: "2",
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
                toolbars: {
                    bold: true, // 粗体
                    italic: true, // 斜体
                    header: true, // 标题
                    underline: true, // 下划线
                    strikethrough: true, // 中划线
                    mark: true, // 标记
                    superscript: true, // 上角标
                    subscript: true, // 下角标
                    quote: true, // 引用
                    ol: true, // 有序列表
                    ul: true, // 无序列表
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    code: true, // code
                    table: true, // 表格
                    fullscreen: true, // 全屏编辑
                    readmodel: true, // 沉浸式阅读
                    htmlcode: true, // 展示html源码
                    help: true, // 帮助
                    /* 1.3.5 */
                    undo: true, // 上一步
                    redo: true, // 下一步
                    trash: true, // 清空
                    save: false, // 保存（触发events中的save事件）
                    /* 1.4.2 */
                    navigation: true, // 导航目录
                    /* 2.1.8 */
                    alignleft: true, // 左对齐
                    aligncenter: true, // 居中
                    alignright: true, // 右对齐
                    /* 2.2.1 */
                    subfield: true, // 单双栏模式
                    preview: true, // 预览
                }
            }
        },
        methods: {
            editor(value, render) {

                this.editorData.markDown = value;
                this.editorData.html = render;
            },
            // 绑定@imgAdd event
            $imgAdd(pos, $file) {
                // 缓存图片信息
                this.img_file[pos] = $file;
                this.imgIsUpload = 0;
            },
            $imgDel(pos) {
                delete this.img_file[pos];
            },
            uploading($e) {
                if (this.editorData.storage == "") {
                    this.$message.warning("请先指定上传图片的目标储存位置和仓库！");
                    return;
                }

                if (this.editorData.resposity == "") {
                    this.$message.warning("请先指定上传图片的目标仓库！");
                    return;
                }

                if (this.editorData.fileTitle == "") {
                    this.$message.warning("请先填写文章标题！ps:图片上传将以文章标题为文件夹名称保存到目标OSS中。。");
                    return;
                }

                // 第一步.将图片上传到服务器.
                for (var _img in this.img_file) {
                    var formdata = new FormData();
                    formdata.append("file", this.img_file[_img]);
                    this.uploadPicture(_img, formdata);
                    formdata.append("storage", this.editorData.storage);
                    formdata.append("resposity", this.editorData.resposity);
                    formdata.append("fileTitle", this.editorData.fileTitle);
                }

                this.imgIsUpload = 1;
            },
            uploadPicture(_img, formdata) {
                this.$http({
                    url: '/api/post/upload/picture',
                    method: 'post',
                    data: formdata,
                    headers: {'Content-Type': 'multipart/form-data'},
                }).then(resp => {
                    /**
                     * 例如：返回数据为 res = [[pos, url], [pos, url]...]
                     * pos 为原图片标志（0）
                     * url 为上传后图片的url地址
                     */
                    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                    // $vm.$img2Url 详情见本页末尾
                    this.$refs.md.$img2Url(_img, resp.data.url);
                        this.$message.success("图片" + _img + "上传成功！");
                }).catch(error =>{
                    this.$message.error("图片" + _img + "上传失败！");
                });
            },
            loadingUpload() {
                this.innerDrawer = true;
                this.$router.push("/admin/system/posts/write/attachments");
            },
            savePost() {
                if (this.imgIsUpload == 0) {
                    this.$message.warning("文章中有图片未上传，请先上传！");
                    return;
                }

                if (this.editorData.markDown == "" || this.editorData.html == "") {
                    this.$message.warning("保存前请先写点什么。。。");
                    return;
                }

                if (this.editorData.fileTitle == "") {
                    this.$message.warning("保存前别忘了加上文章标题哦！");
                    return;
                }

                if(this.editorData.id != ""){
                    this.$http.put("/api/post/update/post", this.editorData).then(resp => {
                        this.$message.success("修改成功！");
                        this.drawer=false;
                    }).catch(error => {
                        this.$message.success("修改失败！");
                    })
                }else {
                    this.$http.post("/api/post/save/post", this.editorData).then(resp => {
                        this.editorData.id = resp.data.id;
                        this.$message.success("保存成功！");
                        this.drawer=false;
                    }).catch(error => {
                        this.$message.success("保存失败！");
                    })
                }

            },
            saveAndDraft(){
                this.editorData.state = "1";
                this.savePost();
            },
            saveAndPubilsh() {
                this.editorData.state = "2";
                this.savePost();
            },
            loadResposity() {
                if (this.editorData.storage == 1) {
                    this.$http.get("/api/file/aliyun/resposity").then(resp => {
                        this.resposity = resp.data;
                    }).catch(error =>{});

                }
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
                        }).catch(error =>{});;
                    } else {
                        return false;
                    }
                });
            },
            saveStart(){
                this.drawer = true;
                this.loadingOptions();
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
                        }).catch(error =>{});;
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