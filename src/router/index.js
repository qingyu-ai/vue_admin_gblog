import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import User from '../components/user/User.vue'
import Dashboard from '../components/dashboard/Dashboard.vue'
import Role from '../components/role/Role.vue'
import Permission from '../components/permission/Permission.vue'
import Message from '../components/message/Message.vue'
import Online from '../components/online/Online.vue'
import Article from '../components/article/Article.vue'
import SendArticle from '../components/article/SendArticle.vue'
import Category from '../components/category/Category.vue'
import Comment from '../components/comment/Comment.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/dashboard',
    children: [
      { path: '/user', component: User },
      { path: '/dashboard', component: Dashboard },
      { path: '/permission', component: Permission },
      { path: '/message', component: Message },
      { path: '/online', component: Online },
      { path: '/role', component: Role },
      { path: '/article', component: Article },
      { path: '/sendArticle', component: SendArticle },
      { path: '/comment', component: Comment },
      { path: '/category', component: Category }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
