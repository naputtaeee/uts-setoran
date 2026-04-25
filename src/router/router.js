const routes = [
    { path: '/', component: LoginView },
    { path: '/dashboard', component: DashboardView, beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('access_token')) next('/');
        else next();
    }},
    { path: '/mahasiswa/:nim', component: DetailView, beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('access_token')) next('/');
        else next();
    }}
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});