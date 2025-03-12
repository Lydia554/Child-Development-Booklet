<template>
  <div class="development-container">
    <h2 class="development-title">Razvoj Deteta - Period: {{ startAge }}-{{ endAge }} Meseci</h2>

    <div v-if="developmentData.length" class="development-data">
      <div v-for="data in developmentData" :key="data._id" class="development-item">
        <p><strong>Fizički razvoj:</strong> {{ data.physicalDevelopment }}</p>
        <p><strong>Emocionalni razvoj:</strong> {{ data.emotionalDevelopment }}</p>
        <p><strong>Intelektualni razvoj:</strong> {{ data.intellectualDevelopment }}</p>
        <p><strong>Socijalni razvoj:</strong> {{ data.socialDevelopment }}</p>
      </div>
    </div>

    <div v-else>
      <p class="no-data-message">Nema podataka za ovaj period.</p>
    </div>

    <div class="navigation-buttons">
      <router-link v-if="startAge > 0" :to="previousPeriod" class="nav-button">Prethodni period</router-link>
      <router-link :to="nextPeriod" class="nav-button">Sledeći period</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['childId', 'startAge'],
  data() {
    return {
      developmentData: [],
      endAge: parseInt(this.startAge) + 6,
    };
  },
  computed: {
    nextPeriod() {
      return `/child-development/${this.childId}/${this.endAge}`;
    },
    previousPeriod() {
      return `/child-development/${this.childId}/${this.startAge - 6}`;
    }
  },
  created() {
    this.fetchDevelopmentData();
  },
  methods: {
    async fetchDevelopmentData() {
      try {
        const response = await axios.get(`https://child-development-backend.fly.dev/api/child-development/${this.childId}/${this.startAge}`);
        this.developmentData = response.data;
      } catch (error) {
        console.error('Greška pri dobijanju podataka:', error);
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
$error-bg: #f8d7da;
$error-border: #f5c6cb;
$error-text: #721c24;
$text-white: white;
$gap-size: 20px;

.dashboard-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.error-message {
  background: $error-bg;
  color: $error-text;
  padding: 15px;
  border: 1px solid $error-border;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
}

.dashboard-links {
  margin-top: $gap-size;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $gap-size;
  margin-top: $gap-size;
}

.dashboard-link {
  display: block;
  padding: 15px;
  background-color: $primary-color;
  color: $text-white;
  text-decoration: none;
  border-radius: 8px;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: $primary-hover;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(0, 91, 187, 0.5);
  }
}

.development-periods {
  margin-top: 30px;
}

.period-links {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.period-link {
  padding: 12px 18px;
  background-color: $success-color;
  color: $text-white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  text-align: center;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: $success-hover;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(40, 167, 69, 0.5);
  }
}

.overview-link {
  margin-top: 30px;
  text-align: center;
  font-size: 1.1rem;
}

/* 📱 Mobile Styles: Optimized for Phones */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 15px;
  }

  .links-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .dashboard-link {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
  }

  .period-links {
    flex-direction: column;
    gap: 10px;
  }

  .period-link {
    width: 100%;
    font-size: 1rem;
    padding: 12px;
  }

  .error-message {
    font-size: 0.9rem;
    padding: 12px;
  }

  h2 {
    font-size: 1.4rem;
    text-align: center;
  }

  .dashboard-links {
    margin-top: 15px;
  }

  .overview-link {
    text-align: center;
    display: block;
    font-size: 1rem;
    margin-top: 20px;
  }
}

/* 📱 Extra Small Mobile Screens (Max 480px) */
@media (max-width: 480px) {
  .dashboard-container {
    padding: 12px;
  }

  .links-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .dashboard-link,
  .period-link {
    font-size: 0.95rem;
    padding: 10px;
    width: 100%;
  }

  .error-message {
    font-size: 0.85rem;
    padding: 10px;
  }

  h2 {
    font-size: 1.2rem;
  }

  .overview-link {
    font-size: 1rem;
    margin-top: 15px;
  }
}

/* 📱 Ultra-Small Mobile Screens (Max 360px) */
@media (max-width: 360px) {
  .dashboard-container {
    padding: 10px;
  }

  .dashboard-link,
  .period-link {
    font-size: 0.85rem;
    padding: 8px;
  }

  .error-message {
    font-size: 0.8rem;
    padding: 8px;
  }

  h2 {
    font-size: 1.1rem;
  }

  .overview-link {
    font-size: 0.9rem;
  }
}
</style>
