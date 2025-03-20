import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    token: null, 
    childIds: [],
    currentChildId: null, 
  }),

  getters: {
    hasChild: (state) => state.childIds.length > 0,
    childId: (state) => state.currentChildId,
  },

  actions: {
    login(token, childId = null) {
      if (!token) {
        console.error("❌ Pokušaj da se sačuva undefined token!");
        return;
      }

      if (process.env.NODE_ENV === 'production') {
        console.log("🔑 Čuvanje tokena u authStore:", token);
      }

      this.isAuthenticated = true;
      this.token = token;
      sessionStorage.setItem('token', token); 

      if (childId) {
        this.addChildId(childId);
      }
    },

    logout() {
      console.log("🚪 Odjava, brisanje tokena...");
      this.isAuthenticated = false;
      this.token = null;
      this.childIds = [];
      this.currentChildId = null;

      sessionStorage.removeItem('token');
      sessionStorage.removeItem('childId');
      sessionStorage.removeItem('childIds');
    },

    checkAuth() {
      const token = sessionStorage.getItem('token');
      const childId = sessionStorage.getItem('childId');
      const childIds = JSON.parse(sessionStorage.getItem('childIds') || '[]');

      if (token) {
        console.log("✅ Token pronađen u sessionStorage:", token);
        this.isAuthenticated = true;
        this.token = token;
        this.childIds = childIds;
        this.currentChildId = childId || null;
      } else {
        console.warn("⚠️ Token nije pronađen u sessionStorage.");
      }
    },

    addChildId(childId) {
      if (!this.childIds.includes(childId)) {
        this.childIds.push(childId);
        sessionStorage.setItem('childIds', JSON.stringify(this.childIds));
      }
      this.setCurrentChildId(childId);
    },

    setCurrentChildId(childId) {
      this.currentChildId = childId;
      sessionStorage.setItem('childId', childId);
    }
  }
});
