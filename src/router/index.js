// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import AboutPage from '../views/AboutPage.vue'
import ProjectsPage from '../views/projects/ProjectsPage.vue'
import ProjectListPage from '../views/projects/ProjectListPage.vue'
import ProjectDetailPage from '../views/projects/ProjectDetailPage.vue'
import ProjectStatsPage from '../views/projects/ProjectStatsPage.vue'
import OwnerPage from '../views/OwnerPage.vue'
import ManagePage from '../views/manage/ManagePage.vue'
import ManageProfilePage from '../views/manage/ManageProfilePage.vue'
import ManageProjectsPage from '../views/manage/ManageProjectsPage.vue'
import ManageSkillsPage from '../views/manage/ManageSkillsPage.vue'
import ArticleListPage from '../views/articles/ArticleListPage.vue'
import ArticleManagePage from '../views/articles/ArticleManagePage.vue'
import NotFoundPage from '../views/NotFoundPage.vue'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { title: '个人主页' }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
    meta: { title: '关于我' }
  },

  // 项目中心：嵌套路由（list / :id / stats）
  {
    path: '/projects',
    name: 'projects',
    component: ProjectsPage,
    meta: { title: '项目中心' },
    // 访问 /projects 默认重定向到项目列表
    redirect: { name: 'project-list' },
    children: [
      {
        path: 'list',
        name: 'project-list',
        component: ProjectListPage,
        meta: { title: '项目列表' }
      },
      {
        path: ':id',
        name: 'project-detail',
        component: ProjectDetailPage,
        meta: { title: '项目详情' }
      },
      {
        path: 'stats',
        name: 'project-stats',
        component: ProjectStatsPage,
        meta: { title: '项目统计' }
      }
    ]
  },

  // 文章列表（公开）
  {
    path: '/articles',
    name: 'article-list',
    component: ArticleListPage,
    meta: { title: '文章列表' }
  },

  // 身份认证页（公开）
  {
    path: '/owner',
    name: 'owner',
    component: OwnerPage,
    meta: { title: '身份验证' }
  },

  // 后台管理：嵌套路由 + meta.requiresOwner 权限标记
  {
    path: '/manage',
    name: 'manage',
    component: ManagePage,
    meta: { title: '内容管理' },
    redirect: { name: 'manage-profile' },
    children: [
      {
        path: 'profile',
        name: 'manage-profile',
        component: ManageProfilePage,
        meta: { title: '编辑个人简介', requiresOwner: true }
      },
      {
        path: 'projects',
        name: 'manage-projects',
        component: ManageProjectsPage,
        meta: { title: '编辑项目信息', requiresOwner: true }
      },
      {
        path: 'skills',
        name: 'manage-skills',
        component: ManageSkillsPage,
        meta: { title: '技能爱好管理', requiresOwner: true }
      },
      {
        path: 'articles',
        name: 'manage-articles',
        component: ArticleManagePage,
        meta: { title: '文章管理', requiresOwner: true }
      }
    ]
  },

  // 404 通配符
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
    meta: { title: '页面不存在' }
  }
]

// 路由模式说明：
// - createWebHistory()：History 模式，URL 干净（如 /projects），但部署到静态服务器时
//   需要配置 fallback 回退到 index.html，否则直接输入深层地址会 404。
// - createWebHashHistory()：Hash 模式，URL 带 #（如 /#/projects），对服务器无要求，
//   部署到 GitHub Pages 后刷新子路由也不会 404。本实验采用 Hash 模式以便上线。
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

// 全局前置守卫：更新标题 + 结合用户 Store 实现登录态访问控制
router.beforeEach((to, from) => {
  // 1. 根据 meta.title 更新浏览器标题
  document.title = to.meta.title ? `${to.meta.title} · 周志欢的个人主页` : '周志欢的个人主页'

  const userStore = useUserStore()

  // 2. 离开后台管理区（/manage）时自动清除登录态：
  //    这样下一次从任何地方进入后台都需要重新验证口令（会话级登录）
  if (from.path.startsWith('/manage') && !to.path.startsWith('/manage')) {
    userStore.logout()
  }

  // 3. requiresOwner 页面：在守卫函数内部调用 Store（确保 Pinia 已完成初始化），
  //    读取用户 Store 的登录状态，未登录则跳转到身份验证页，并记下原目标
  if (to.meta.requiresOwner && !userStore.isLogin) {
    return { name: 'owner', query: { redirect: to.fullPath } }
  }
})

export default router
