import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main'
import Login from './views/Login'
import Register from './views/Register'
import User from './views/User'
import Users from './views/Users'
import ErrorPage from './views/ErrorPage'

Vue.use(Router)
export default new Router({
    mode: 'history',
    routes: [{
            path: '/login',
            component: Login
        },
        {
            path: '/register',
            component: Register
        },
        {
            path: '/',
            component: Main
        },
        {
            path: '/user/:email',
            component: User
        },
        {
            path: '/users',
            component: Users
        },
        {
            path: '*',
            component: ErrorPage
        }
    ]
})