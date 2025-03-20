<template>
  <div class="login-container">
    <h2>Prijavite se</h2>
    <form @submit.prevent="loginUser">
      <input type="email" v-model="email" placeholder="Email" required />
      <div class="password-container">
        <input :type="passwordVisible ? 'text' : 'password'" v-model="password" placeholder="Lozinka" required />
        <label>
          <input type="checkbox" v-model="passwordVisible" /> Prikaži lozinku
        </label>
      </div>
      <button type="submit">Prijavite se</button>
    </form>


    <div v-if="showRegisterButton" class="register-button-container">
      <p>Nema registrovane dece. Molimo vas da registrujete dete.</p>
      <button @click="redirectToChildRegistration">Registrujte dete</button>
    </div>
  </div>
</template>


<script>
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      passwordVisible: false,
      errorMessage: '',
      showRegisterButton: false, 
    };
  },
  methods: {
    async loginUser() {
      try {
        const loginResponse = await axios.post('https://child-development-backend.fly.dev/api/users/login', {
          email: this.email,
          password: this.password,
        });

        const token = loginResponse.data.token;
        sessionStorage.setItem('token', token);

        const authStore = useAuthStore();
        authStore.login(token);

        const childrenResponse = await axios.get('https://child-development-backend.fly.dev/api', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (childrenResponse.data && childrenResponse.data.length > 0) {
          const userChild = childrenResponse.data[0];
          authStore.addChildId(userChild._id);
          this.$router.push('/dashboard');
        } else {
          console.log('No children found, showing register button.');
          this.showRegisterButton = true; 
        }
      } catch (error) {
        console.error('❌ Login error:', error);
        this.errorMessage = error.response?.data?.message || 'Pogrešan email ili lozinka.';
      }
    },
    redirectToChildRegistration() {
      this.$router.push('/child-registration');
    },
  },
};
</script>


<style lang="scss" scoped>
$primary-color: #007bff;
$primary-hover: #0056b3;
$background-light: #ffffff;
$border-color: #ddd;
$text-color: #333;
$error-color: red;

.login-container {
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
}

.password-container {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 5px;
  font-size: 14px;
}

.error-message {
  color: $error-color;
  font-weight: bold;
  margin-bottom: 10px;
}

.signup-link {
  margin-top: 20px;

  button {
    background: none;
    border: none;
    color: $primary-color;
    cursor: pointer;
    font-size: 16px;
    text-decoration: underline;

    &:hover {
      color: $primary-hover;
    }
  }
}

.register-button-container {
  margin-top: 20px;
  text-align: center;

  p {
    margin-bottom: 10px;
    color: $text-color;
    font-size: 16px;
  }

  button {
    background-color: $primary-color;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    border: none;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: $primary-hover;
    }

    &:focus {
      outline: none;
    }
  }
}

/* 📱 Mobile Styles: Optimized for Phones */
@media (max-width: 768px) {
  .login-container {
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

/* 📱 Extra Small Mobile Screens (Max 480px) */
@media (max-width: 480px) {
  .login-container {
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

/* 📱 Ultra-Small Mobile Screens (Max 360px) */
@media (max-width: 360px) {
  .login-container {
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