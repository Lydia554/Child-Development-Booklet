<template>
  <div class="milestone-form-container">
    <h2>{{ isEditing ? "Izmeni Kljucni Momenat" : "Dodaj Kljucni Momenat" }}</h2>

    <form @submit.prevent="submitForm" class="milestone-form">
      <!-- Milestone Type -->
      <div class="form-group">
        <label for="milestoneType">Tip Ključnog Momenta:</label>
        <input
          v-model="milestone.milestoneType"
          type="text"
          id="milestoneType"
          required
          placeholder="Npr. Prvi korak, Prva reč..."
          @blur="validateMilestoneType"
        />
        <div v-if="milestoneTypeError" class="error-message">{{ milestoneTypeError }}</div>
      </div>

      <!-- Milestone Date -->
      <div class="form-group">
        <label for="milestoneDate">Datum:</label>
        <input v-model="milestone.milestoneDate" type="date" id="milestoneDate" required @blur="validateMilestoneDate" />
        <div v-if="milestoneDateError" class="error-message">{{ milestoneDateError }}</div>
      </div>

      <!-- Progress -->
      <div class="form-group">
        <label for="progress">Napredak:</label>
        <textarea
          v-model="milestone.progress"
          id="progress"
          required
          placeholder="Opišite napredak..."
          @blur="validateProgress"
        ></textarea>
        <div v-if="progressError" class="error-message">{{ progressError }}</div>
      </div>

      <!-- Notes -->
      <div class="form-group">
        <label for="notes">Napomene:</label>
        <textarea v-model="milestone.notes" id="notes" placeholder="Dodatne napomene..."></textarea>
      </div>

      <div class="button-group">
        <button type="submit" class="submit-btn" :disabled="hasErrors">
          {{ isEditing ? "Sačuvaj Izmene" : "Dodaj Kljucni Momenat" }}
        </button>
        <button type="button" @click="goBack" class="cancel-btn">Otkaži</button>
      </div>
    </form>
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
          `http://localhost:5000/api/milestones/${this.milestoneId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data) {
          this.milestone = {
            ...response.data,
            milestoneDate: new Date(response.data.milestoneDate).toISOString().split("T")[0]
          };
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
            `http://localhost:5000/api/milestones/${this.milestoneId}`,
            this.milestone,
            { headers }
          );
        } else {
          await axios.post(`http://localhost:5000/api/milestones/${this.childId}`, this.milestone, {
            headers
          });
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
$primary-hover: #218838;
$danger-color: #dc3545;
$danger-hover: #c82333;
$text-color: #333;
$text-muted: #555;
$background-light: #fff;
$border-color: #ddd;

.milestone-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  color: $text-muted;
}

.milestone-form {
  background-color: $background-light;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: $text-color;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: $text-muted;
  font-size: 1rem;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid $border-color;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  height: 100px;
  resize: vertical;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
}


  .submit-btn {
  padding: 12px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-align: center;
}

.submit-btn {
  background-color: $primary-color;
  color: white;

  &:hover {
    background-color: $primary-hover;
  }
}

.cancel-btn {
  background-color: $danger-color;
  color: white;

  &:hover {
    background-color: $danger-hover;
  }
}

@media (max-width: 768px) {
  .milestone-form-container {
    padding: 15px;
  }

  h2 {
    font-size: 22px;
  }

  input,
  textarea {
    font-size: 0.95rem;
    padding: 8px;
  }

  .button-group {
    flex-direction: column;
    gap: 8px;
  }

  .submit-btn,
  .cancel-btn {
    width: 100%;
    font-size: 1rem;
    padding: 14px;
  }
}


@media (max-width: 480px) {
  .milestone-form-container {
    padding: 12px;
  }

  h2 {
    font-size: 20px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  input,
  textarea {
    font-size: 0.9rem;
    padding: 8px;
  }

  .submit-btn,
  .cancel-btn {
    font-size: 0.9rem;
    padding: 12px;
  }
}

/* 📱 */
@media (max-width: 360px) {
  .milestone-form-container {
    padding: 10px;
  }

  h2 {
    font-size: 18px;
  }

  .submit-btn,
  .cancel-btn {
    font-size: 0.85rem;
    padding: 10px;
  }
}
</style>
