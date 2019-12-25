<template>
    <div class="post">
        <div>
            <el-card class="Breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/admin/system/dashboard' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>用户</el-breadcrumb-item>
                    <el-breadcrumb-item>关于我</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </div>
        <div align="left">
            <div style="border: 1px solid #DCDFE6;width: 89%;margin-left: 5%;background-color: #FFF;height: 40px;line-height: 40px;padding-left: 1%">关于我<i style="color: #CECECE">(此页内容将会呈现在首页的【关于】页面中)</i></div>
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
                <div style="margin-top: -10%;padding-left: 5%;">
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
                        <div style="margin-bottom: 3%">开启评论：</div>
                        <div style="margin-bottom: 5%">
                            <el-radio v-model="editorData.comment" label="1">是</el-radio>
                            <el-radio v-model="editorData.comment" label="2">否</el-radio>
                        </div>
                        <el-divider></el-divider>
                        <div style="position: fixed;width: 30%;height: 7%;background-color: #F2F6FC;bottom: 0px;z-index: 5;vertical-align: middle;margin-left: -1.5%;border-top:1px solid #cacaca;">
                            <div style="vertical-align: middle;padding-right: 5%;padding-top: 2%" align="right">
                                <el-button size="small" type="primary" @click="savePost">保存</el-button>
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
        name: "system-about",
        created(){
                this.$http.get("/api/admin/about/find").then(resp => {
                    this.editorData.id = resp.data.id;
                    this.editorData.resposity = resp.data.resposity;
                    this.editorData.storage = resp.data.storage;
                    this.editorData.fileTitle = resp.data.fileTitle;
                    //this.editorData.html = resp.data.html;
                    this.post = resp.data.markDown;
                    this.editorData.comment = resp.data.comment;
                }).catch(error => {
                    this.$message.error("数据查询失败！");
                });
        },
        data() {
            return {
                post:"",//文章回显
                show:true,
                show2:true,
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
                    fileTitle:"关于我",
                    resposity: "",
                    storage: "",
                    html: "",
                    markDown: "",
                    comment: "2"
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
                if (this.editorData.storage == "" || this.editorData.storage == undefined) {
                    this.$message.warning("请先指定上传图片的目标储存位置和仓库！");
                    return;
                }

                if (this.editorData.resposity == "" || this.editorData.resposity == undefined) {
                    this.$message.warning("请先指定上传图片的目标仓库！");
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

                if (this.editorData.comment == "" || this.editorData.comment == undefined) {
                    this.$message.warning("请先设置是否开启评论！");
                    return;
                }

                this.editorData.fileTitle = "关于我";
                if(this.editorData.id != "" && this.editorData.id != null){
                    this.$http.put("/api/admin/update/about", this.editorData).then(resp => {
                        this.$message.success("修改成功！");
                        this.drawer=false;
                    }).catch(error => {
                        this.$message.success("修改失败！");
                    })
                }else {
                    this.editorData.id = -1;
                    this.$http.post("/api/admin/save/about", this.editorData).then(resp => {

                        this.editorData.id = resp.data.id;
                        this.$message.success("保存成功！");
                        this.drawer=false;
                    }).catch(error => {
                        this.$message.success("保存失败！");
                    })
                }

            },
            loadResposity() {
                if (this.editorData.storage == 1) {
                    this.$http.get("/api/file/aliyun/resposity").then(resp => {
                        this.resposity = resp.data;
                    }).catch(error =>{});

                }
            },
            saveStart(){
                this.drawer = true;
            }
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