import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/dictionary',
    component: Layout,
    name: 'Dictionary',
    meta: { title: '字典管理', icon: '' },
    children: [
      {
        path: 'admin',
        name: 'DictionaryAdmin',
        component: () => import('@/components/dictionary/admin'),
        meta: { title: '字典管理', icon: '' }
      },
      {
        path: 'attributeGroupAdmin',
        name: 'AttributeGroupAdmin',
        component: () => import('@/components/dictionary/attributegroup/admin'),
        meta: { title: '属性分组管理', icon: '' }
      },
      {
        path: 'categoryAdmin',
        name: 'CategoryAdmin',
        component: () => import('@/components/category/admin'),
        meta: { title: '分类管理', icon: '' }
      }
    ]
  },
  {
    path: '/media',
    component: Layout,
    name: 'Media',
    meta: { title: '媒体管理', icon: '' },
    children: [
      {
        path: 'mediaAdmin',
        name: 'MediaAdmin',
        component: () => import('@/components/media/admin'),
        meta: { title: '媒体管理', icon: '' }
      },
      {
        path: 'admin/add',
        name: 'MediaAdd',
        component: () => import('@/components/media/add/add'),
        meta: { title: '新增媒体', icon: '' }
      }
    ]
  },
  {
    path: '/rank',
    component: Layout,
    name: 'Rank',
    meta: { title: '排行榜管理', icon: '' },
    children: [
      {
        path: 'rankAdmin',
        name: 'RankAdmin',
        component: () => import('@/components/rank/admin'),
        meta: { title: '排行榜管理', icon: '' }
      },
      {
        path: 'detail/:id',
        name: 'RankDetail',
        component: () => import('@/components/rank/detail/detail'),
        meta: { title: '排行榜详情', icon: '' },
        hidden: true
      },
      {
        path: 'singleMediaMap/:mediaId/:rankId',
        name: 'SingleMediaMap',
        component: () => import('@/components/rank/singlemediamap/singlemediamap'),
        hidden: true
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'User',
    meta: { title: '用户管理', icon: '' },
    children: [
      {
        path: 'userAdmin',
        name: 'UserAdmin',
        component: () => import('@/components/user/user'),
        meta: { title: '用户管理', icon: '' }
      },
      {
        path: 'singerAdmin',
        name: 'SingerAdmin',
        component: () => import('@/components/user/singer/singer'),
        meta: { title: '歌手管理', icon: '' }
      }
    ]
  },
  {
    path: '/album',
    component: Layout,
    name: 'Album',
    meta: { title: '专辑管理', icon: '' },
    children: [
      {
        path: 'admin',
        name: 'AlbumAdmin',
        component: () => import('@/components/album/album'),
        meta: { title: '专辑管理', icon: '' }
      }
    ]
  },
  {
    path: '/songList',
    component: Layout,
    name: 'SongList',
    meta: { title: '歌单管理', icon: '' },
    children: [
      {
        path: 'admin',
        name: 'SongListAdmin',
        component: () => import('@/components/songlist/songlist'),
        meta: { title: '歌单管理', icon: '' }
      }
    ]
  },
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
