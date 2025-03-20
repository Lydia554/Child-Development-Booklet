<template>
  <div>
    <nav v-if="showNavigation">
      <!-- Dashboard link when authenticated -->
      <router-link v-if="authStore.isAuthenticated" to="/dashboard">Dashboard</router-link>

      <!-- Child registration only if no child -->
      <router-link v-if="authStore.isAuthenticated && !hasChild" to="/child-registration">Registracija deteta</router-link>
      
      <!-- Other links only if has child and not on dashboard -->
      <template v-if="authStore.isAuthenticated && hasChild && !isDashboard">
        <router-link :to="`/milestone-form/${childId}`">Dodaj Ključni Momenat</router-link>
        <router-link :to="`/milestone-list/${childId}`">Pregled Ključnog Momenta</router-link>
        <router-link :to="`/child-development-form/${childId}`">Unos razvoja deteta</router-link>
        <router-link :to="`/child-development-list/${childId}`">Pregled razvoja</router-link>
        <router-link :to="`/child-overview/${childId}`">Pregled sve Dece</router-link>
      </template>

      <!-- Auth links -->
      <router-link v-if="!authStore.isAuthenticated" to="/login">Prijavite se</router-link>
      <router-link v-if="!authStore.isAuthenticated" to="/">Registrujte se</router-link>

      <button v-if="authStore.isAuthenticated" @click="logout" class="logout-btn">Odjavi se</button>
    </nav>

    <router-view />
  </div>
</template>

<script>
import { useAuthStore } from './stores/authStore';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();

    const childId = computed(() => authStore.childId || sessionStorage.getItem('childId'));
    const hasChild = computed(() => !!childId.value);
    
    const isDashboard = computed(() => route.name === 'dashboard');

    const showNavigation = computed(() => {
      if (route.name === 'login' || route.name === 'signup') {
        return false;
      }
      if (route.name === 'dashboard') {
        return true;
      }
      return authStore.isAuthenticated && hasChild.value;
    });

    const logout = () => {
      authStore.logout();
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('childId');
      router.push('/login');
    };

    authStore.checkAuth();

    return { 
      authStore, 
      logout,
      childId,
      hasChild,
      isDashboard,
      showNavigation
    };
  }
};
</script>


<style lang="scss" scoped>
$primary-color: #007bff;
$hover-primary: #0056b3;
$background-light: #f8f9fa;
$border-color: #dee2e6;
$logout-bg: #690aa8;
$logout-hover: #250891;
$text-color: white;

nav {
  margin-bottom: 20px;
  padding: 15px;
  background-color: $background-light;
  border-bottom: 1px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  a {
    margin-right: 15px;
    text-decoration: none;
    color: $primary-color;
    padding: 8px 14px;
    border-radius: 5px;
    font-size: 1rem;
    transition: background 0.3s ease, color 0.3s ease;

    &:hover {
      background-color: $primary-color;
      color: $text-color;
    }

    &.router-link-active {
      background-color: $primary-color;
      color: $text-color;
      font-weight: bold;
    }
  }
}

.logout-btn {
  padding: 10px 18px;
  background-color: $logout-bg;
  color: $text-color;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: $logout-hover;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(105, 10, 168, 0.5);
  }
}

/* 📱 Mobile Styles: Optimized for Phones */
@media (max-width: 768px) {
  nav {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
  }

  nav a {
    display: block;
    margin: 5px 0;
    font-size: 0.95rem;
  }

  .logout-btn {
    width: 100%;
    text-align: center;
    font-size: 1rem;
    padding: 12px;
    margin-top: 10px;
  }
}

/* 📱 Extra Small Mobile Screens (Max 480px) */
@media (max-width: 480px) {
  nav {
    padding: 10px;
  }

  nav a {
    font-size: 0.9rem;
    padding: 6px 12px;
  }

  .logout-btn {
    font-size: 0.95rem;
    padding: 10px;
  }
}

/* 📱 Ultra-Small Mobile Screens (Max 360px) */
@media (max-width: 360px) {
  nav {
    padding: 8px;
  }

  nav a {
    font-size: 0.85rem;
    padding: 6px 10px;
  }

  .logout-btn {
    font-size: 0.9rem;
    padding: 10px;
  }
}
</style>