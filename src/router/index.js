import {
  createRouter,
  createWebHistory
} from 'vue-router'

import store from '../store'

const homeRoutes = [{
    path: '/',
    name: 'Index',
    component: () => import('../views/Index/Index.vue'),
    meta: {
      title: '首页 | Light'
    },
    children: [{
        path: '/',
        name: 'Main',
        component: () => import('../views/Main/Index.vue'),
        meta: {
          title: '首页 | Light'
        }
      },
      {
        path: '/article/:id',
        component: () => import('../views/Article/Index.vue'),
        meta: {
          title: '文章 | Light'
        }
      },
      {
        path: '/category',
        name: 'Category',
        component: () => import('../views/Category/Index.vue'),
        meta: {
          title: '分类 | Light'
        },
        children: [{
          path: '/category/:id', //动态路由，具体分类
          name: 'CategoryDetail',
          component: () => import('../views/Category/Child/Index.vue'),
          meta: {
            title: '分类 | Light'
          }
        }]
      },
      {
        path: '/tags',
        name: 'Tags',
        component: () => import('../views/Tag/Index.vue'),
        meta: {
          title: '标签 | Light'
        }
      },
      {
        path: '/tag/:id',
        name: 'Tag',
        component: () => import('../views/Tag/Child/Index.vue'),
        meta: {
          title: '标签 | Light'
        }
      },
      {
        path: '/archives',
        name: 'Archives',
        component: () => import('../views/Archives/Index.vue'),
        meta: {
          title: '归档 | Light'
        }
      },
      {
        path: '/message',
        name: 'MessageBoard',
        component: '../views/Message/Index.vue',
        meta: {
          title: '留言板 | Light'
        }
      },
      {
        path: '/link',
        name: 'Link',
        component: () => import('../views/Link/Index.vue'),
        meta: {
          title: '友情链接 | Light'
        }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('../views/About/Index.vue'),
        meta: {
          title: '关于 | Light'
        }
      }
    ]
  },
  {
    path: '/index',
    redirect: '/',
    meta: {
      title: '首页 | Light'
    }
  },

]

const adminRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/Index.vue'),
    meta: {
      title: '登录 | Light'
    }
  },
  {
    path: '/manage',
    name: 'Manage',
    component: () => import('../views/Manage/Index.vue'),
    meta: {
      title: '管理 | Light',
    },
    redirect: '/manage/index',
    children: [
      {
        path: '/manage/index',
        name: 'ManageIndex',
        component: () => import('../views/Manage/Child/Index.vue')
      },
      {
        path: '/manage/article/list',
        nama: 'ArticleListView',
        component: () => import('../views/Manage/Child/ArticleListView.vue')
      },
      {
        path: '/manage/article/edit/:id',
        nama: 'EditArticleView',
        meta: {
          keepAlive: false
        },
        component: () => import('../views/Manage/Child/EditArticleView.vue')
      },
      {
        path: '/manage/article/add',
        nama: 'AddArticleView',
        component: () => import('../views/Manage/Child/EditArticleView.vue')
      },
      {
        path: '/manage/user/list',
        name: 'UserListView',
        component: () => import('../views/Manage/Child/UserListView.vue')
      },
      {
        path: '/manage/role/list',
        name: 'RoleView',
        component: () => import('../views/Manage/Child/RoleView.vue')
      },
      {
        path: '/manage/right/list',
        name: 'RightView',
        component: () => import('../views/Manage/Child/RightView.vue')
      },
      {
        path: '/manage/log/list',
        name: 'LogView',
        component: () => import('../views/Manage/Child/LogView.vue')
      },
      {
        path: '/manage/tag/list',
        name: 'TagsView',
        component: () => import('../views/Manage/Child/TagsView.vue')
      },
      {
        path: '/manage/category/list',
        name: 'CategoryListView',
        component: () => import('../views/Manage/Child/CategoryList.vue')
      },
      {
        path: '/manage/link/list',
        name: 'LinkView',
        component: () => import('../views/Manage/Child/LinkView.vue')
      },
      {
        path: '/manage/comment/article',
        name: 'CommentListView',
        component: () => import('../views/Manage/Child/CommentListView.vue')
      },
      {
        path: '/manage/comment/board',
        name: 'MessageBoardListView',
        component: () => import('../views/Manage/Child/MessageBoardView.vue')
      },
      {
        path: '/manage/recycle/article',
        name: 'ArticleRecycleView',
        component: () =>import('../views/Manage/Child/ArticleRecycleView.vue')
      },
      {
        path: '/manage/recycle/user',
        name: 'UserRecycleView',
        component: () =>import('../views/Manage/Child/UserRecycleView.vue')
      },
      {
        path: '/manage/recycle/comment',
        name: 'CommentRecycleView',
        component: () =>import('../views/Manage/Child/CommentRecycleView.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('../views/Error/404.vue'),
    meta: {
      title: '无此页面 | Light'
    }
  }
]

const routes = homeRoutes.concat(adminRoutes)

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

/**
 * 路由之前执行，添加标题
 */
router.beforeEach((to, from, next) => {
  const {
    meta,
    path
  } = to
  if (meta) {
    for (let name in meta) {
      document.title = meta[name] ? meta[name] : 'Light Blog'
    }
  } else {
    document.title = 'Light Blog'
  }
  if(isNavPath(path)){
    store.state.isActive = true
  }else{
    store.state.isActive = false
  }
  next()
})

const navs = [
  '/',
  '/tags',
  '/category',
  '/link',
  '/archives',
  '/message',
  '/about'
]

const isNavPath = (path) => {
  for (let index in navs) {
    const item = navs[index]
    if(item === path){
      return true
    }
  }
  return false
}


export default router