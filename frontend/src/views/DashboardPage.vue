<template>
  <div class="dashboard-container">
    <h2>Dobrodošli na Dashboard</h2>

    <div v-if="loading">Loading...</div>

    <div v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-else-if="currentChild && currentChild._id">
      <h3>Opcije za dete: {{ currentChild.name }}</h3>

      <div class="dashboard-links">
        <div class="links-grid">
          <router-link :to="`/milestone-form/${currentChild._id}`" class="dashboard-link">Dodaj Ključni Momenat</router-link>
          <router-link :to="`/milestone-list/${currentChild._id}`" class="dashboard-link">Pregled Ključnog Momenta</router-link>
          <router-link :to="`/child-development-form/${currentChild._id}`" class="dashboard-link">Unos razvoja deteta</router-link>
          <router-link :to="`/child-development-list/${currentChild._id}`" class="dashboard-link">Pregled razvoja</router-link>
          <router-link :to="`/child-overview/${currentChild._id}`" class="dashboard-link">Pregled sve Dece</router-link>
        </div>
      </div>
      <div class="register-another-child">
        <router-link to="/child-registration" class="dashboard-link">Registruj Još Jedno Dete</router-link>
      </div>
    </div>

    <div v-else class="error-message">
      <p>Nema podataka o detetu. Molimo proverite unos ili registrujte dete.</p>
      <router-link to="/child-registration" class="dashboard-link">Registruj Dete</router-link>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import { watch, ref, onMounted } from 'vue';

export default {
  setup() {
    const authStore = useAuthStore();
    const loading = ref(true);
    const currentChild = ref(null);
    const errorMessage = ref('');

    
    const fetchCurrentChild = async () => {
      try {
        let childId = authStore.childId; 

        if (!childId) {
          errorMessage.value = "Nema registrovanog deteta. Molimo registrujte dete.";
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/${childId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });

        currentChild.value = response.data;
      } catch (error) {
        console.error("❌ Greška prilikom učitavanja deteta:", error);
        errorMessage.value = "Greška prilikom učitavanja podataka.";
      } finally {
        loading.value = false;
      }
    };

   
    onMounted(() => {
      fetchCurrentChild();
    });

  
    watch(() => authStore.childId, async (newChildId) => {
      if (newChildId) {
        console.log("🔄 Detected child change, refreshing data...");
        await fetchCurrentChild();
      }
    });

    return {
      loading,
      currentChild,
      errorMessage,
    };
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

.register-another-child {
  margin-top: $gap-size;
  text-align: center;
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
  padding: 10px 15px;
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
    gap: 15px;
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
    gap: 10px;
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