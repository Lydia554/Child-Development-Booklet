<template>
  <div class="development-form">
    <h2>Unos Razvoja Deteta</h2>
    <h3>Trenutni period: {{ currentPeriod.startAge }} - {{ currentPeriod.endAge }} meseci</h3>
    <h3>Trenutna starost deteta: {{ childAgeInMonths }} meseci</h3>

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
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";

export default {
  data() {
    return {
      formData: {
        physicalDevelopment: "",
        emotionalDevelopment: "",
        intellectualDevelopment: "",
        socialDevelopment: "",
      },
      currentPeriod: {
        startAge: null,
        endAge: null,
      },
      childBirthDate: null,
      childAgeInMonths: null,
      error: null,
      loading: false,

      physicalError: null,
      emotionalError: null,
      intellectualError: null,
      socialError: null,

      hasErrors: false,
    };
  },

  async created() {
    console.log("🔄 Component Created: Fetching child and period data...");
    await this.initializeForm();
  },

  methods: {
    async initializeForm() {
      const authStore = useAuthStore();
      const token = authStore.token;
      const childId = authStore.childId;

      console.log("📢 Fetching child data...");
      const childResponse = await axios.get(
        `https://child-development-backend.fly.dev/api/${childId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (childResponse.data) {
        this.childBirthDate = childResponse.data.birthDate;
        this.childAgeInMonths = this.calculateAgeInMonths(this.childBirthDate);

        
        const { startAge, endAge } = this.$route.query;
        if (startAge && endAge) {
          this.currentPeriod = { startAge: parseInt(startAge), endAge: parseInt(endAge) };
        } else {
          this.setCurrentPeriod(this.childAgeInMonths);
        }
      }

      console.log("🔍 Fetching existing development data...");
      const response = await axios.get(
        `https://child-development-backend.fly.dev/api/child-development/${childId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.length > 0) {
        const existingPeriod = response.data.find(
          (p) => p.startAge === this.currentPeriod.startAge && p.endAge === this.currentPeriod.endAge
        );

        if (existingPeriod) {
          console.log("✅ Found existing data for period:", existingPeriod);
          this.formData = { ...existingPeriod };
        }
      }
    },

    calculateAgeInMonths(birthDate) {
      const birth = new Date(birthDate);
      const now = new Date();
      return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    },

    setCurrentPeriod(ageInMonths) {
      const periodLength = 6; 
      const startAge = Math.floor(ageInMonths / periodLength) * periodLength;
      const endAge = startAge + periodLength;

      this.currentPeriod = { startAge, endAge };
    },

    validateInput(field) {
      this.hasErrors = false;
      const inputValue = this.formData[field].trim().length;

      if (inputValue < 5) {
        this[`${field}Error`] = `Polje ${field} mora imati najmanje 5 karaktera.`;
        this.hasErrors = true;
      } else {
        this[`${field}Error`] = null;
      }
    },

    async saveDevelopment() {
      if (this.hasErrors) {
        this.error = "Molimo ispravite greške pre nego što pošaljete podatke.";
        return;
      }

      try {
        this.loading = true;
        const authStore = useAuthStore();
        const childId = authStore.childId;
        const token = authStore.token;

        console.log("📤 Sending development data:", this.formData);

        const periodData = {
          startAge: this.currentPeriod.startAge,
          endAge: this.currentPeriod.endAge,
          physicalDevelopment: this.formData.physicalDevelopment,
          emotionalDevelopment: this.formData.emotionalDevelopment,
          intellectualDevelopment: this.formData.intellectualDevelopment,
          socialDevelopment: this.formData.socialDevelopment,
        };

        const response = await axios.post(
          `https://child-development-backend.fly.dev/api/child-development/${childId}`,
          periodData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Development data saved:", response.data);

        this.$router.push(`/child-development-list/${childId}`);
      } catch (error) {
        console.error("❌ Error saving development:", error);
        this.error = "Greška pri čuvanju podataka.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 14px;
}
</style>

<style lang="scss" scoped>
$primary-color: #4CAF50;
$primary-disabled: #cccccc;
$error-bg: #ffebee;
$error-text: red;
$border-color: #ddd;
$text-color: #333;
$background-light: #ffffff;

.development-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
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
  min-height: 120px;
  padding: 12px;
  border: 1px solid $border-color;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
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
}

/* 📱 Mobile Styles: Optimized for Phones */
@media (max-width: 768px) {
  .development-form {
    padding: 15px;
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
    width: 100%;
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