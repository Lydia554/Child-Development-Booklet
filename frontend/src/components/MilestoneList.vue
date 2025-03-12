<template>
  <div class="milestone-list-container">
    <h2>Pregled Ključnih Momenata</h2>
    <div v-if="milestones.length" class="milestone-list">
      <div v-for="milestone in milestones" :key="milestone._id" class="milestone-item">
        <h3>{{ milestone.milestoneType }} - {{ formatDate(milestone.milestoneDate) }}</h3>
        <p><strong>Napredak:</strong> {{ milestone.progress }}</p>
        <p><strong>Napomene:</strong> {{ milestone.notes }}</p>

        <div class="button-group">
         
          <button @click="editMilestone(milestone._id)" class="edit-btn">Izmeni</button>
       
          <button @click="confirmDelete(milestone._id)" class="delete-btn">Obriši</button>
        </div>
      </div>
    </div>

    <div v-else class="no-data-message">
      <p>Nema podataka o Ključnim Momentima za ovo dete.</p>
    </div>

    <router-link :to="`/milestone-form/${childId}`" class="add-milestone-button">
      Dodaj Ključni Momenat
    </router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      milestones: [],
      childId: null,
    };
  },

  created() {
    this.childId = this.$route.params.childId;
    if (!this.childId) {
      this.$router.push('/child-registration');
      return;
    }
    this.fetchMilestones();
  },

  methods: {
    async fetchMilestones() {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`https://child-development-backend.fly.dev/api/milestones/${this.childId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.milestones = response.data;

      
        if (process.env.NODE_ENV !== 'production') {
          console.log("Milestones fetched:", response.data);
        }
      } catch (error) {
        console.error('Error fetching milestones:', error);
      }
    },

    formatDate(value) {
      if (!value) return '';
      const date = new Date(value);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    },

    editMilestone(id) {
      this.$router.push(`/milestone-form/${this.childId}/${id}`);
    },

    async deleteMilestone(id) {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.delete(`https://child-development-backend.fly.dev/api/milestones/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        this.milestones = this.milestones.filter(milestone => milestone._id !== id);

        
        if (process.env.NODE_ENV !== 'production') {
          console.log('Milestone deleted:', response.data);
        }
      } catch (error) {
        console.error('Error deleting milestone:', error);
      }
    },

    async confirmDelete(id) {
      if (window.confirm('Da li ste sigurni da želite da obrišete ovaj milestone?')) {
        await this.deleteMilestone(id);
      }
    }
  }
};
</script>



<style lang="scss" scoped>
$primary-color: #007bff;
$primary-hover: #0056b3;
$success-color: #28a745;
$success-hover: #218838;
$danger-color: #dc3545;
$danger-hover: #c82333;
$light-gray: #f7f7f7;
$text-dark: #333;
$text-muted: #555;
$text-light: #666;
$gap-size: 15px;

.milestone-list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: $light-gray;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    font-size: 24px;
    color: $text-dark;
    margin-bottom: 20px;
  }

  .milestone-list {
    display: flex;
    flex-direction: column;
    gap: $gap-size;
  }

  .milestone-item {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

    h3 {
      font-size: 20px;
      color: $text-dark;
      margin-bottom: 10px;
    }

    p {
      margin: 8px 0;
      color: $text-muted;
    }

    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 15px;
      flex-wrap: wrap;
    }

    .edit-btn,
    .delete-btn {
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      text-align: center;
    }

    .edit-btn {
      background-color: $success-color;
      color: white;

      &:hover {
        background-color: $success-hover;
      }
    }

    .delete-btn {
      background-color: $danger-color;
      color: white;

      &:hover {
        background-color: $danger-hover;
      }
    }
  }

  .no-data-message {
    text-align: center;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    color: $text-light;
  }

  .add-milestone-button {
    display: inline-block;
    margin-top: 20px;
    padding: 12px 24px;
    background-color: $primary-color;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    text-align: center;

    &:hover {
      background-color: $primary-hover;
    }
  }
}

/* 📱 Mobile Styles: Optimized for Phones */
@media (max-width: 768px) {
  .milestone-list-container {
    padding: 15px;
  }

  h2 {
    font-size: 22px;
  }

  .milestone-item {
    padding: 15px;
  }

  .button-group {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .edit-btn,
  .delete-btn {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
  }

  .add-milestone-button {
    width: 100%;
    font-size: 1rem;
    padding: 14px;
  }
}

/* 📱 Extra Small Mobile Screens (Max 480px) */
@media (max-width: 480px) {
  .milestone-list-container {
    padding: 12px;
  }

  h2 {
    font-size: 20px;
  }

  .milestone-item {
    padding: 12px;
  }

  .edit-btn,
  .delete-btn {
    font-size: 0.9rem;
    padding: 10px;
  }

  .add-milestone-button {
    font-size: 0.9rem;
    padding: 12px;
  }
}

/* 📱 Ultra-Small Mobile Screens (Max 360px) */
@media (max-width: 360px) {
  .milestone-list-container {
    padding: 10px;
  }

  h2 {
    font-size: 18px;
  }

  .milestone-item {
    padding: 10px;
  }

  .edit-btn,
  .delete-btn {
    font-size: 0.85rem;
    padding: 8px;
  }

  .add-milestone-button {
    font-size: 0.85rem;
    padding: 10px;
  }
}
</style>
