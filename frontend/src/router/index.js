import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import DashboardPage from '../views/DashboardPage.vue';
import SignupPage from '../components/SignupPage.vue';
import LoginPage from '../components/LoginPage.vue';
import ChildDevelopmentPage from '../views/ChildDevelopmentPage.vue';
import MilestoneForm from '@/components/MilestoneForm.vue';
import MilestoneList from '../components/MilestoneList.vue';
import ChildDevelopmentForm from '@/components/ChildDevelopmentForm.vue';
import ChildDevelopmentList from '@/components/ChildDevelopmentList.vue';
import ChildDevelopmentPeriod from '../components/ChildDevelopmentPeriod.vue';
import ChildRegistrationForm from '../components/ChildRegistrationForm.vue';
import ChildOverview from '../components/ChildOverview.vue';
import DevelopmentInfoPage from '../components/DevelopmentInfoPage.vue';

const routes = [
  { 
    path: '/', 
    component: SignupPage, 
    name: 'signup',
    meta: { requiresAuth: false, guestOnly: true } 
  },
  { 
    path: '/login', 
    component: LoginPage, 
    name: 'login',
    meta: { requiresAuth: false, guestOnly: true } 
  },
  { 
    path: '/dashboard', 
    component: DashboardPage, 
    name: 'dashboard',
    meta: { requiresAuth: true } 
  },
  { 
    path: '/child-registration', 
    component: ChildRegistrationForm, 
    name: 'child-registration',
    meta: { requiresAuth: true } 
  },
  { 
    path: '/milestone-form/:childId/:milestoneId?', 
    component: MilestoneForm, 
    name: 'milestone-form',
    meta: { requiresAuth: true, requiresChild: true },
    props: true 
  },
  { 
    path: '/milestone-list/:childId', 
    component: MilestoneList, 
    name: 'milestone-list',
    meta: { requiresAuth: true, requiresChild: true },
    props: true 
  },
  { 
    path: '/child-development-list/:childId', 
    component: ChildDevelopmentList, 
    name: 'ChildDevelopmentList',
    meta: { requiresAuth: true, requiresChild: true },
    props: true 
  },
  { 
    path: '/child-development-page/:childId', 
    component: ChildDevelopmentPage, 
    name: 'child-development-page',
    meta: { requiresAuth: true, requiresChild: true },
    props: true 
  },
  { 
    path: '/period', 
    component: ChildDevelopmentPeriod, 
    name: 'period',
    meta: { requiresAuth: true, requiresChild: true },
    props: true 
  },
  { 
    path: '/child-overview/:childId', 
    component: ChildOverview, 
    name: 'child-overview',
    meta: { requiresAuth: true, requiresChild: true },
    props: true 
  },
  {
    path: '/add-development/:childId',
    name: 'AddDevelopmentData',
    component: ChildDevelopmentForm
  },
  {
    path: '/add-milestone/:childId',
    name: 'AddMilestone',
    component: MilestoneForm
  },
  {
    path: '/child-development-form/:childId',
    name: 'ChildDevelopmentForm',
    component: ChildDevelopmentForm
  },
  {
    path: '/child-development/:childId',
    name: 'child-development',
    component: ChildDevelopmentForm,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/child-development-list/:childId',
    name: 'ChildDevelopmentList',
    component: ChildDevelopmentList
  },

  {
    path: '/development-info',
    component: DevelopmentInfoPage,
    name: 'development-info',
    meta: { requiresAuth: true } 
  },
  


];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
    return;
  }


  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next('/dashboard');
    return;
  }

  
  if (to.meta.requiresChild && !authStore.hasChild) {
    next('/child-registration');
    return;
  }


  next();
});

export default router;