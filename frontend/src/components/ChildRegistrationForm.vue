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
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

export default {
  data() {
    return {
      name: '',
      birthdate: '',
      errorMessage: '',
    };
  },

  methods: {
    async registerChild() {
      
      if (!this.name || !this.birthdate) {
        this.errorMessage = 'Ime i datum su obavezni.';
        return;
      }

      const formattedBirthdate = new Date(this.birthdate).toISOString();

      try {
        const response = await axios.post(
          'https://child-development-backend.fly.dev/api', 
          { name: this.name, birthDate: formattedBirthdate }, 
          { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
        );

        if (response.data) {
          const authStore = useAuthStore(); 
          authStore.addChildId(response.data._id);
          this.$router.push('/dashboard'); 
        }

        
      } catch (error) {
        if (process.env.NODE_ENV === 'production') {
          console.error("❌ Error registering child:", error); 
        }
        this.errorMessage = 'Došlo je do greške pri registraciji deteta.'; 
      }
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
