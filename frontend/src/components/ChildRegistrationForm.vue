<template>
  <div class="registration-container">
    <h2>Registracija Deteta</h2>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="registerChild">
      <input type="text" v-model="name" placeholder="Ime deteta" required />
      <input type="date" v-model="birthdate" required />
      <button type="submit">Registruj Dete</button>
    </form>

    <div class="dashboard-link">
      <router-link to="/dashboard">Idi na Dashboard</router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["childId", "milestoneId"],

  data() {
    return {
      milestone: {
        milestoneType: "",
        milestoneDate: "",
        progress: "",
        notes: "",
        startAge: this.$route.query.startAge || 0,
        endAge: this.$route.query.endAge || 0,
        childId: this.childId
      },
      isEditing: false,
      milestoneTypeError: null,
      milestoneDateError: null,
      progressError: null,
      hasErrors: false
    };
  },

  async created() {
    if (this.milestoneId) {
      this.isEditing = true;
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `https://child-development-backend.fly.dev/api/milestones/${this.milestoneId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data) {
          this.milestone = {
            ...response.data,
            milestoneDate: new Date(response.data.milestoneDate).toISOString().split("T")[0]
          };
        }

       
        if (process.env.NODE_ENV !== 'production') {
          console.log("Fetched milestone data:", this.milestone);
        }

      } catch (error) {
        console.error("Error fetching milestone:", error);
      }
    }
  },

  methods: {

    validateMilestoneType() {
      if (!this.milestone.milestoneType.trim()) {
        this.milestoneTypeError = "Tip momenta je obavezan.";
        this.hasErrors = true;
      } else {
        this.milestoneTypeError = null;
      }
    },

    validateMilestoneDate() {
      if (!this.milestone.milestoneDate) {
        this.milestoneDateError = "Datum je obavezan.";
        this.hasErrors = true;
      } else {
        this.milestoneDateError = null;
      }
    },

    validateProgress() {
      if (!this.milestone.progress.trim()) {
        this.progressError = "Napredak je obavezan.";
        this.hasErrors = true;
      } else {
        this.progressError = null;
      }
    },

    async submitForm() {

      this.validateMilestoneType();
      this.validateMilestoneDate();
      this.validateProgress();

      if (this.hasErrors) {
        return; 
      }

      try {
        const token = sessionStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        if (this.isEditing) {
          await axios.put(
            `https://child-development-backend.fly.dev/api/milestones/${this.milestoneId}`,
            this.milestone,
            { headers }
          );
          
         
          if (process.env.NODE_ENV !== 'production') {
            console.log("Updated milestone:", this.milestone);
          }

        } else {
          await axios.post(`https://child-development-backend.fly.dev/api/milestones/${this.childId}`, this.milestone, {
            headers
          });

          
          if (process.env.NODE_ENV !== 'production') {
            console.log("Created new milestone:", this.milestone);
          }
        }

        this.$router.push(`/child-development-list/${this.childId}`);
      } catch (error) {
        console.error("Error saving milestone:", error);
      }
    },

    formatPeriod(start, end) {
      return `${start}-${end} meseci`;
    },

    goBack() {
      this.$router.push(`/child-development-list/${this.childId}`);
    }
  }
};
</script>




<style lang="scss" scoped>
$primary-color: #28a745;
$primary-hover: #1e7e34;
$background-light: #f8f9fa;
$border-color: #ccc;
$text-color: #333;
$error-color: #dc3545;

.registration-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 40px;
  background-color: $background-light;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  font-size: 24px;
  color: $text-color;
  margin-bottom: 30px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

input {
  padding: 12px;
  border-radius: 6px;
  border: 1px solid $border-color;
  font-size: 14px;
  width: 100%;
  transition: border-color 0.3s;

  &:focus {
    border-color: $primary-color;
    outline: none;
  }
}

button {
  background-color: $primary-color;
  color: white;
  padding: 14px 20px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;

  &:hover {
    background-color: $primary-hover;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.error-message {
  color: $error-color;
  font-weight: bold;
  font-size: 14px;
  margin-top: -5px;
}

.dashboard-link {
  margin-top: 20px;

  a {
    color: $primary-color;
    font-size: 16px;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s;

    &:hover {
      color: $primary-hover;
    }
  }
}

/* 📱 Mobile Styles */
@media (max-width: 768px) {
  .registration-container {
    padding: 30px;
  }

  input {
    font-size: 16px;
  }

  button {
    font-size: 18px;
    padding: 16px;
  }
}

/* 📱 Small Screens (Max 480px) */
@media (max-width: 480px) {
  .registration-container {
    padding: 25px;
  }

  h2 {
    font-size: 22px;
  }

  input {
    font-size: 15px;
    padding: 10px;
  }

  button {
    font-size: 16px;
    padding: 14px;
  }
}

/* 📱 Ultra-Small Screens (Max 360px) */
@media (max-width: 360px) {
  .registration-container {
    padding: 20px;
  }

  h2 {
    font-size: 20px;
  }

  input {
    font-size: 14px;
    padding: 10px;
  }

  button {
    font-size: 15px;
    padding: 12px;
  }
}
</style>
