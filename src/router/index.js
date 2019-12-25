import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/index.vue";
import NotFound from "../views/404.vue";
import Admin from "../views/admin.vue";
import System from "../views/system.vue";
import Dashboard from "../components/system-dashboard.vue";
import PostsWrite from "../components/system-posts-write.vue";
import PostsList from "../components/system-posts-list.vue";
import PostsCategories from "../components/system-posts-categories.vue";
import PostsTags from "../components/system-posts-tags.vue";
import Attachments from "../components/system-attachments.vue";
import Options from "../components/system-options.vue";
import UserProfile from "../components/system-user-profile.vue";
import IndexIndex from "../components/index-index.vue";
import IndexPost from "../components/index-post.vue";
import IndexCategories from "../components/index-categories.vue";
import IndexTimeLine from "../components/index-timeline.vue";
import IndexArchives from "../components/index-archives.vue";
import IndexTags from "../components/index-tags.vue";
import IndexAbout from "../components/index-about.vue";
import SystemComment from "../components/system-comment.vue";
import SystemAbout from "../components/system-about.vue";
import SheetsNote from "../components/system-sheets-note.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
    children: [
      { path: '', component: IndexIndex },
      { path: '/index/index', name: 'indexIndex', component: IndexIndex },
      { path: '/index/post', name: 'indexPost', component: IndexPost },
      { path: '/index/categories', name: 'indexCategories', component: IndexCategories },
      { path: '/index/timeline', name: 'indexTimeline', component: IndexTimeLine },
      { path: '/index/archives', name: 'indexArchives', component: IndexArchives },
      { path: '/index/tags', name: 'indexTags', component: IndexTags },
      { path: '/index/about', name: 'indexAbout', component: IndexAbout },
    ]

  },
  {
    path: "/admin",
    name: "admin",
    component: Admin
  },
  {
    path: "/admin/system",
    name: "system",
    component: System,
    children: [
    { path: '', component: Dashboard },
    { path: '/admin/system/dashboard', name: 'dashboard', component: Dashboard },
    { path: '/admin/system/attachments', name: 'attachments', component: Attachments },
    { path: '/admin/system/options', name: 'options', component: Options },
    { path: '/admin/system/user/profile', name: 'userProfile', component: UserProfile },
    { path: '/admin/system/posts/list', name: 'postsList', component: PostsList },
    { path: '/admin/system/posts/categories', name: 'postsCategories', component: PostsCategories },
    { path: '/admin/system/comment', name: 'comment', component: SystemComment },
    { path: '/admin/system/about', name: 'about', component: SystemAbout },
    { path: '/admin/system/posts/tags', name: 'postsTags', component: PostsTags },
    { path: '/admin/system/sheets/notes', name: 'sheetsNote', component: SheetsNote },
    {path: '/admin/system/posts/write', name: 'postsWrite', component: PostsWrite,
      children: [{ path: '/admin/system/posts/write/attachments', name: 'innerAttachments', component: Attachments }]},
]
  },
  {
    path: "*",
    name: "404",
    component: NotFound
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

//路由守卫
router.beforeEach((to,from,next) => {
/*  let isLogin=document.cookie.indexOf("Admin_Token=");
  if(to.path == "/admin" || to.path.startsWith("/index") || to.path == "/") {
    next();
  } else {
    isLogin==0 ? next() : next("/admin");
  }*/
    let isLogin = localStorage.token ? true : false;
    if(to.path == "/admin" || to.path.startsWith("/index") || to.path == "/") {
        next();
    } else {
        isLogin ? next() : next("/admin");
    }
})

export default router;
