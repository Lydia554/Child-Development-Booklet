<template>
  <div class="signup-container">
    <h2>Registrujte se</h2>
    <form @submit.prevent="registerUser">
      <input
        type="email"
        v-model="email"
        placeholder="Email"
        required
        @blur="validateEmail"
        @input="validateForm"
      />
      <div v-if="emailError" class="error-message">{{ emailError }}</div>

      <div class="password-container">
        <input
          :type="passwordVisible ? 'text' : 'password'"
          v-model="password"
          placeholder="Lozinka"
          required
          @blur="validatePassword"
          @input="validateForm"
        />
        <label>
          <input type="checkbox" v-model="passwordVisible" /> Prikaži lozinku
        </label>
        <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
      </div>

      <input
        type="text"
        v-model="name"
        placeholder="Ime"
        required
        @blur="validateName"
        @input="validateForm"
      />
      <div v-if="nameError" class="error-message">{{ nameError }}</div>

      <button type="submit" :disabled="hasErrors">Registrujte se</button>
    </form>
    <div class="login-link">
      <p>Već imate nalog? <button @click="navigateToLogin">Ulogujte se</button></p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      passwordVisible: false,
      errorMessage: '',

      emailError: null,
      passwordError: null,
      nameError: null,
      hasErrors: true,
    };
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email.trim()) {
        this.emailError = 'Email je obavezan.';
        this.hasErrors = true;
      } else if (!emailRegex.test(this.email)) {
        this.emailError = 'Unesite validan email.';
        this.hasErrors = true;
      } else {
        this.emailError = null;
      }
    },

    validatePassword() {
      if (!this.password.trim()) {
        this.passwordError = 'Lozinka je obavezna.';
        this.hasErrors = true;
      } else if (this.password.length < 6) {
        this.passwordError = 'Lozinka mora imati najmanje 6 karaktera.';
        this.hasErrors = true;
      } else {
        this.passwordError = null;
      }
    },

    validateName() {
      if (!this.name.trim()) {
        this.nameError = 'Ime je obavezno.';
        this.hasErrors = true;
      } else {
        this.nameError = null;
      }
    },

    validateForm() {
      this.validateEmail();
      this.validatePassword();
      this.validateName();
      this.hasErrors = !!(this.emailError || this.passwordError || this.nameError);
    },

    async registerUser() {
      this.validateForm();

      if (this.hasErrors) {
        return;
      }

      try {
        const registerResponse = await axios.post('https://child-development-backend.fly.dev/api/users/register', {
          name: this.name,
          email: this.email,
          password: this.password,
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Registration successful:', registerResponse.data);

        const loginResponse = await axios.post('https://child-development-backend.fly.dev/api/users/login', {
          email: this.email,
          password: this.password,
        });

        const token = loginResponse.data.token;
        sessionStorage.setItem('token', token);

        const authStore = useAuthStore();
        authStore.login(token);

        this.$router.push('/child-registration');
        
      } catch (error) {
        console.error('Greška pri registraciji:', error);
        if (error.response) {
          console.log('Error response data:', error.response.data);
          this.errorMessage = error.response.data.message || 'Server error occurred';
        } else if (error.request) {
          this.errorMessage = 'No response from server';
        } else {
          this.errorMessage = error.message;
        }
      }
    },

    navigateToLogin() {
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="scss" scoped>
$primary-color: #007bff;
$primary-hover: #0056b3;
$background-light: #ffffff;
$border-color: #ddd;
$text-color: #333;
$error-color: red;

.signup-container {
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

.password-container {
  display: flex;
  flex-direction: column;

  label {
    margin-top: 5px;
    font-size: 14px;
  }
}

.error-message {
  color: $error-color;
  font-weight: bold;
  margin-bottom: 10px;
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
    background-color: #ccc;
    cursor: not-allowed;
  }
}

.login-link {
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

/* 📱 Mobile Styles */
@media (max-width: 768px) {
  .signup-container {
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
  .signup-container {
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
  .signup-container {
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