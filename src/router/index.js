import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layout/Layout'       // 布局的组件
import ArticleDetail from '@/page/articleDetail/ArticleDetail'      // 文章详情页
import ProfessorColumn from '@/page/professorColumn/ProfessorColumn'  // 专家专栏
import imgModal from '@/components/modal/imgModal'
import Search from '@/page/search/Search'
import Home from '@/page/home/Home'
import PersonalInfo from '@/page/home/PersonalInfo'
import NickName from '@/page/home/NickName'
import PersonalIntro from '@/page/home/PersonalIntro'
import ArticleListByTag from '@/page/articleListByTag/ArticleListByTag'
import SearchInput from '@/components/searchInput/SearchInput'
import EmailLink from '@/page/home/EmailLink'
import PhoneLink from '@/page/home/PhoneLink'
import PasswordModify from '@/page/home/PasswordModify'
import AccountSecurity from '@/page/home/AccountSecurity'
import Register from '@/page/home/Register'
import Login from '@/page/home/Login'
import PasswordRetrieve from '@/page/home/PasswordRetrieve'
import AdviceFeedback from '@/page/home/AdviceFeedback'
import AboutUs from '@/page/home/AboutUs'
import MyCollections from '@/page/home/MyCollections'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'Layout',
      component: Layout,
      children: [
        {
          path: 'articleDetail/:articleId',
          component: ArticleDetail,
          children: [
            {
              path: 'imgModal',
              component: imgModal
            }
          ]
        },
        {
          path: 'professorColumn/:professorId',
          component: ProfessorColumn,
          children: [
            {
              path: 'articleDetail/:articleId',
              component: ArticleDetail,
              children: [
                {
                  path: 'imgModal',
                  component: imgModal
                }
              ]
            }
          ]
        }
      ]
    }, {
      path: '/home',
      component: Home
    }, {
      path: '/articleDetail/:articleId',
      component: ArticleDetail
    }, {
      path: '/personalInfo',
      component: PersonalInfo
    }, {
      path: '/nickName',
      component: NickName
    }, {
      path: '/personalIntro',
      component: PersonalIntro
    }, {
      path: '/search',
      component: Search,
      children: [
        {
          path: 'articleDetail/:articleId',
          component: ArticleDetail,
          children: [
            {
              path: 'imgModal',
              component: imgModal
            }
          ]
        }
      ]
    }, {
      path: '/searchInput',
      component: SearchInput
    }, {
      path: '/articleListByTag',
      component: ArticleListByTag,
      children: [
        {
          path: 'articleDetail/:articleId',
          component: ArticleDetail,
          children: [
            {
              path: 'imgModal',
              component: imgModal
            }
          ]
        }
      ]
    }, {
      path: '/emailLink',
      component: EmailLink
    }, {
      path: '/passwordModify',
      component: PasswordModify
    }, {
      path: '/register',
      component: Register
    }, {
      path: '/login',
      component: Login
    }, {
      path: '/passwordRetrieve',
      component: PasswordRetrieve
    }, {
      path: '/accountSecurity',
      component: AccountSecurity
    }, {
      path: '/adviceFeedback',
      component: AdviceFeedback
    }, {
      path: '/aboutUs',
      component: AboutUs
    }, {
      path: '/myCollections',
      component: MyCollections,
      children: [
        {
          path: 'articleDetail/:articleId',
          component: ArticleDetail,
          children: [
            {
              path: 'imgModal',
              component: imgModal
            }
          ]
        }
      ]
    }, {
      path: '/phoneLink',
      component: PhoneLink
    }, {
      path: '/',
      redirect: '/index'
    }
  ],
  mode: 'hash'
})
