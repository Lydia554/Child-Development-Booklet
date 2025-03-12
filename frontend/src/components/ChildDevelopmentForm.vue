<template>
  <div class="development-form">
    <h2>Unos Razvoja Deteta</h2>

    <!-- Ensure currentPeriod is defined before accessing its properties -->
    <h3 v-if="currentPeriod">Trenutni period: {{ currentPeriod.startAge }} - {{ currentPeriod.endAge }} meseci</h3>
    <h3 v-if="childAgeInMonths">Trenutna starost deteta: {{ childAgeInMonths }} meseci</h3>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <form @submit.prevent="saveDevelopment">
      <div class="form-group">
        <label for="physicalDevelopment">Fizički razvoj:</label>
        <textarea id="physicalDevelopment" v-model="formData.physicalDevelopment" required @input="validateInput('physicalDevelopment')"></textarea>
        <div v-if="physicalError" class="error-message">{{ physicalError }}</div>
      </div>

      <div class="form-group">
        <label for="emotionalDevelopment">Emocionalni razvoj:</label>
        <textarea id="emotionalDevelopment" v-model="formData.emotionalDevelopment" required @input="validateInput('emotionalDevelopment')"></textarea>
        <div v-if="emotionalError" class="error-message">{{ emotionalError }}</div>
      </div>

      <div class="form-group">
        <label for="intellectualDevelopment">Intelektualni razvoj:</label>
        <textarea id="intellectualDevelopment" v-model="formData.intellectualDevelopment" required @input="validateInput('intellectualDevelopment')"></textarea>
        <div v-if="intellectualError" class="error-message">{{ intellectualError }}</div>
      </div>

      <div class="form-group">
        <label for="socialDevelopment">Socijalni razvoj:</label>
        <textarea id="socialDevelopment" v-model="formData.socialDevelopment" required @input="validateInput('socialDevelopment')"></textarea>
        <div v-if="socialError" class="error-message">{{ socialError }}</div>
      </div>

      <button type="submit" :disabled="loading || hasErrors">
        {{ loading ? "Čuvanje..." : "Sačuvaj" }}
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

export default {
  data() {
    return {
      childName: null,
      childAge: null,
      developmentData: [],
      milestoneData: [],
      availablePeriods: [],
      selectedPeriod: null,
      childBirthDate: null,
      error: null,
      loading: false,
      hasErrors: false,
      formData: {
        physicalDevelopment: '',
        emotionalDevelopment: '',
        intellectualDevelopment: '',
        socialDevelopment: ''
      },
      physicalError: null,
      emotionalError: null,
      intellectualError: null,
      socialError: null
    };
  },

  computed: {
    currentPeriod() {
      return this.selectedPeriod
        ? this.developmentData.find(
            (d) =>
              d.startAge === this.selectedPeriod.start &&
              d.endAge === this.selectedPeriod.end
          )
        : null;
    },

    childAgeInMonths() {
      return this.childAge;
    }
  },

  methods: {
    validateInput(field) {
      if (!this.formData[field].trim()) {
        this[`${field}Error`] = `${field} is required`;
        this.hasErrors = true;
      } else {
        this[`${field}Error`] = null;
        this.hasErrors = false;
      }
    },

    async saveDevelopment() {
      
      const { childId } = this.$route.params;
      const periodData = {
        startAge: this.selectedPeriod.start,
        endAge: this.selectedPeriod.end,
        physicalDevelopment: this.formData.physicalDevelopment,
        emotionalDevelopment: this.formData.emotionalDevelopment,
        intellectualDevelopment: this.formData.intellectualDevelopment,
        socialDevelopment: this.formData.socialDevelopment
      };

      try {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (process.env.NODE_ENV !== 'production') {
          console.log("📤 Saving development data:", periodData);
        }

        const response = await axios.post(
          `https://child-development-backend.fly.dev/api/child-development/${childId}`,
          periodData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        this.$router.push({ path: '/child-development-list' });
      } catch (error) {
        console.error("❌ Error saving development:", error);
        this.error = "There was an error saving the development data.";
      }
    },

    async fetchChildData(childId) {
      try {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (process.env.NODE_ENV !== 'production') {
          console.log("🔍 Fetching child data for:", childId);
        }

        const response = await axios.get(`https://child-development-backend.fly.dev/api/${childId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          this.childName = response.data.name;
          this.childAge = this.calculateAgeInMonths(response.data.birthDate);
          this.childBirthDate = response.data.birthDate;
          this.generateAvailablePeriods();
        }
      } catch (error) {
        console.error("❌ Error fetching child data:", error);
      }
    },

    async fetchDevelopmentData(childId) {
      try {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (process.env.NODE_ENV !== 'production') {
          console.log("📢 Fetching development data for:", childId);
        }

        const response = await axios.get(
          `https://child-development-backend.fly.dev/api/child-development/${childId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.developmentData = response.data || [];
        
        if (process.env.NODE_ENV !== 'production') {
          console.log("📊 Development data:", this.developmentData);
        }
      } catch (error) {
        console.error("❌ Error fetching development data:", error);
      }
    },

    async fetchMilestones(childId) {
      try {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (process.env.NODE_ENV !== 'production') {
          console.log("📢 Fetching milestones for:", childId);
        }

        const response = await axios.get(
          `https://child-development-backend.fly.dev/api/milestones/${childId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.milestoneData = response.data || [];
        
        if (process.env.NODE_ENV !== 'production') {
          console.log("✅ Fetched Milestones:", this.milestoneData);
        }
      } catch (error) {
        console.error("❌ Error fetching milestones:", error);
      }
    },

    getMilestonesForPeriod(period) {
      if (!this.childBirthDate) {
        console.warn("⚠️ Child birth date is missing, cannot filter milestones.");
        return [];
      }

      const birthDate = new Date(this.childBirthDate);
      const startDate = new Date(birthDate);
      startDate.setMonth(startDate.getMonth() + period.start);

      const endDate = new Date(birthDate);
      endDate.setMonth(endDate.getMonth() + period.end);

      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔎 Filtering milestones between ${startDate.toISOString()} - ${endDate.toISOString()}`);
      }

      const filteredMilestones = this.milestoneData.filter(milestone => {
        const milestoneDate = new Date(milestone.milestoneDate);
      
        if (process.env.NODE_ENV !== 'production') {
          console.log(`🔍 Checking Milestone: ${milestone.milestoneType} - ${milestoneDate.toISOString()}`);
        }

        return milestoneDate >= startDate && milestoneDate < endDate;
      });

      if (process.env.NODE_ENV !== 'production') {
        console.log("📌 Matched Milestones for Period:", filteredMilestones);
      }
      return filteredMilestones;
    },

    calculateAgeInMonths(birthDate) {
      if (!birthDate) return 0;
      const birth = new Date(birthDate);
      const now = new Date();
      return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    },

    generateAvailablePeriods() {
      if (this.childAge === null) return;
      this.availablePeriods = [];
      for (let i = 0; i <= 72; i += 6) {
        this.availablePeriods.push({ start: i, end: i + 6 });
      }
    },

    formatPeriod(start, end) {
      return `${start}-${end} meseci`;
    },
  },

  async created() {
    try {
      const childId = this.$route.params.childId;
      if (childId) {
        await this.fetchChildData(childId);
        await this.fetchDevelopmentData(childId);
      }
    } catch (error) {
      console.error("❌ Error in created():", error);
    }
  }
};
</script>

<style lang="scss" scoped>
$primary-color: #4CAF50;
$primary-disabled: #cccccc;
$error-bg: #ffebee;
$error-text: red;
$border-color: #ddd;
$text-color: #333;
$background-light: #ffffff;

.development-form {
  max-width: 100%; 
  width: 100%; 
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box; 
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center; 
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: $text-color;
  font-size: 1rem;
}

textarea {
  width: 100%;
  min-height: 160px;  
  padding: 12px;
  border: 1px solid $border-color;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  box-sizing: border-box;
}

button {
  padding: 12px 20px;
  background-color: $primary-color;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  width: 100%; 

  &:hover {
    background-color: darken($primary-color, 10%);
  }

  &:disabled {
    background-color: $primary-disabled;
    cursor: not-allowed;
  }
}

.error-message {
  color: $error-text;
  margin-bottom: 20px;
  padding: 10px;
  background-color: $error-bg;
  border-radius: 4px;
  text-align: center;
  width: 100%; 
  box-sizing: border-box;
}

/* 📱 Mobile Styles: Optimized for Phones */
@media (max-width: 768px) {
  .development-form {
    padding: 15px;
    width: 100%; 
  }

  label {
    font-size: 0.95rem;
  }

  textarea {
    font-size: 0.95rem;
    padding: 10px;
  }

  button {
    font-size: 1rem;
    padding: 14px;
  }
}

/* 📱 Extra Small Mobile Screens (Max 480px) */
@media (max-width: 480px) {
  .development-form {
    padding: 12px;
  }

  label {
    font-size: 0.9rem;
  }

  textarea {
    font-size: 0.9rem;
    padding: 10px;
  }

  button {
    font-size: 0.95rem;
    padding: 12px;
  }
}

/* 📱 Ultra-Small Mobile Screens (Max 360px) */
@media (max-width: 360px) {
  .development-form {
    padding: 10px;
  }

  label {
    font-size: 0.85rem;
  }

  textarea {
    font-size: 0.85rem;
    padding: 8px;
  }

  button {
    font-size: 0.9rem;
    padding: 10px;
  }
}
</style>
