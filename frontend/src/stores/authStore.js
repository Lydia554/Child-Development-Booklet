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
        console.error("❌ Trying to store an undefined token!");
        return;
      }

      console.log("🔑 Storing token in authStore:", token);
      this.isAuthenticated = true;
      this.token = token;
      sessionStorage.setItem('token', token); 

      if (childId) {
        this.addChildId(childId);
      }
    },

    logout() {
      console.log("🚪 Logging out, clearing token...");
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
        console.log("✅ Token found in sessionStorage:", token);
        this.isAuthenticated = true;
        this.token = token;
        this.childIds = childIds;
        this.currentChildId = childId || null;
      } else {
        console.warn("⚠️ No token found in sessionStorage.");
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