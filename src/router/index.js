import {
  createRouter,
  createWebHistory
} from 'vue-router'

const homeRoutes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/Index/Index.vue'),
    meta: {
      title: '首页 | Light'
    },
    children: [
      {
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
        },
        props: route => ({
          id: route.query.id
        })
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

const adminRoutes = [{
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
    title: '管理 | Light'
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
    meta
  } = to
  if (meta) {
    for (let name in meta) {
      document.title = meta[name] ? meta[name] : 'Light Blog'
    }
  } else {
    document.title = 'Light Blog'
  }
  next()
})

export default router