<template>
  <div class="overview-container">
    <h2>Pregled razvoja deteta - {{ child.name || 'Nepoznato dete' }}</h2>

    <div v-if="loading">Učitavanje podataka...</div>
    <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-else>
      <!-- Dropdown za izbor deteta -->
      <div class="select-container" v-if="children.length > 0">
        <label for="child-select">Izaberite dete:</label>
        <select v-model="selectedChildId" @change="onChildSelect">
          <option v-for="child in children" :key="child._id" :value="child._id">
            {{ child.name }}
          </option>
        </select>
        <div v-if="selectedChildId && !child" class="error-message">Izaberite dete kako biste videli podatke.</div>
      </div>
      
      <!-- Tabela sa podacima o razvoju -->
      <h3>Razvoj deteta</h3>
      <table v-if="developmentData.length > 0" class="development-table">
        <thead>
          <tr>
            <th>Period</th>
            <th>Fizički razvoj</th>
            <th>Emocionalni razvoj</th>
            <th>Intelektualni razvoj</th>
            <th>Socijalni razvoj</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="period in developmentData" :key="period.startAge">
            <td>{{ period.startAge }} - {{ period.endAge }} meseci</td>
            <td>{{ period.physicalDevelopment || '-' }}</td>
            <td>{{ period.emotionalDevelopment || '-' }}</td>
            <td>{{ period.intellectualDevelopment || '-' }}</td>
            <td>{{ period.socialDevelopment || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <div v-else class="error-message">Nema podataka o razvoju za ovo dete.</div>

      <!-- Tabela sa milestone podacima -->
      <h3>Ključni momenti</h3>
      <table v-if="milestoneData.length > 0" class="milestone-table">
        <thead>
          <tr>
            <th>Tip momenta</th>
            <th>Datum</th>
            <th>Napredak</th>
            <th>Napomene</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="milestone in milestoneData" :key="milestone._id">
            <td>{{ milestone.milestoneType }}</td>
            <td>{{ formatDate(milestone.milestoneDate) }}</td>
            <td>{{ milestone.progress || '-' }}</td>
            <td>{{ milestone.notes || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <div v-else class="error-message">Nema ključnih momenata za ovo dete.</div>

      <!-- Dugme za preuzimanje PDF-a -->
      <button @click="downloadPDF" class="pdf-button" :disabled="!developmentData.length || !milestoneData.length">Preuzmi PDF</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuthStore } from "@/stores/authStore";

export default {
  data() {
    return {
      children: [],
      selectedChildId: "",
      child: {},
      developmentData: [],
      milestoneData: [],
      loading: true,
      errorMessage: "",
    };
  },
  async created() {
    await this.fetchChildren();
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString("sr-RS");
    },

    async fetchChildren() {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.children = response.data;
        console.log("Lista dece učitana:", this.children);

        const authStore = useAuthStore();
        if (authStore.childId) {
          this.selectedChildId = authStore.childId;
        } else if (this.children.length > 0) {
          this.selectedChildId = this.children[0]._id;
          authStore.setCurrentChildId(this.selectedChildId);
        }

        await this.fetchChildData(this.selectedChildId);
        await this.fetchDevelopmentData(this.selectedChildId);
        await this.fetchMilestones(this.selectedChildId);
      } catch (error) {
        console.error("❌ Greška pri učitavanju dece:", error);
        this.errorMessage = "Nije moguće učitati listu dece.";
      } finally {
        this.loading = false;
      }
    },

    async fetchChildData(childId) {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/${childId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.data || Object.keys(response.data).length === 0) {
          this.errorMessage = "Podaci o detetu nisu pronađeni.";
          return;
        }

        this.child = response.data;
        console.log("Podaci o detetu:", this.child);
      } catch (error) {
        console.error("❌ Greška pri dobijanju podataka o detetu:", error);
        this.errorMessage = "Nije moguće učitati podatke o detetu.";
      }
    },

    async fetchDevelopmentData(childId) {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/child-development/${childId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.developmentData = response.data || [];
      } catch (error) {
        console.error("❌ Greška pri dobijanju podataka o razvoju:", error);
        this.errorMessage = "Nije moguće učitati razvojne podatke.";
      }
    },

    async fetchMilestones(childId) {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/milestones/${childId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.milestoneData = response.data || [];
      } catch (error) {
        console.error("❌ Greška pri dobijanju ključnih momenata:", error);
      }
    },

    async onChildSelect() {
      console.log("Odabrano dete ID:", this.selectedChildId);
      const authStore = useAuthStore();
      authStore.setCurrentChildId(this.selectedChildId);
      await this.fetchChildData(this.selectedChildId);
      await this.fetchDevelopmentData(this.selectedChildId);
      await this.fetchMilestones(this.selectedChildId);
    },

    downloadPDF() {
      const doc = new jsPDF();

      doc.setFont("FreeSerif");

      doc.text(`Razvoj deteta: ${this.child.name}`, 10, 10);

      const developmentTable = [
        ["Period", "Fizicki", "Emocionalni", "Intelektualni", "Socijalni"],
        ...this.developmentData.map((period) => [
          `${period.startAge}-${period.endAge} meseci`,
          period.physicalDevelopment || "-",
          period.emotionalDevelopment || "-",
          period.intellectualDevelopment || "-",
          period.socialDevelopment || "-",
        ]),
      ];

      const milestoneTable = [
        ["Tip momenta", "Datum", "Napredak", "Napomene"],
        ...this.milestoneData.map((milestone) => [
          milestone.milestoneType,
          this.formatDate(milestone.milestoneDate),
          milestone.progress || "-",
          milestone.notes || "-",
        ]),
      ];

      autoTable(doc, { head: [developmentTable[0]], body: developmentTable.slice(1), startY: 20 });
      autoTable(doc, { head: [milestoneTable[0]], body: milestoneTable.slice(1), startY: doc.lastAutoTable.finalY + 10 });

      doc.save(`Razvoj_${this.child.name}.pdf`);
    },
  },
};
</script>


<style lang="scss" scoped>
.overview-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;

  h2 {
    text-align: center;
    font-size: 28px;
    margin-bottom: 20px;
  }


  .loading, .error-message {
    text-align: center;
    font-size: 18px;
    color: #ff0000;
  }

  .select-container {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    label {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    select {
      width: 60%;
      max-width: 300px;
      padding: 12px;
      font-size: 16px;
      font-weight: bold;
      color: #333;
      background-color: #f0f0f0;
      border: 2px solid #007bff;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;

      &:hover {
        background-color: #e0e0e0;
      }

      &:focus {
        outline: none;
        border-color: #004085;
        box-shadow: 0 0 8px rgba(0, 91, 187, 0.5);
      }
    }
  }

  
  h3 {
    font-size: 22px;
    margin-bottom: 10px;
    text-align: center;
    color: #333;
  }

  .development-table,
  .milestone-table {
    width: 100%;
    margin: 0 auto;
    border-collapse: collapse;
    border: 1px solid #ddd;
    margin-bottom: 20px;

    th, td {
      padding: 12px;
      text-align: left;
      border: 1px solid #ddd;
    }

    th {
      background-color: #007bff;
      color: white;
    }

    td {
      font-size: 14px;
    }

    td, th {
      word-wrap: break-word;
    }
  }


  .milestone-table {
    margin-top: 20px;
  }


  .pdf-button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;

    &:hover {
      background-color: #218838;
    }
  }

 
  @media (max-width: 768px) {
    padding: 15px;

    h2 {
      font-size: 22px;
    }

    .select-container {
      width: 100%;
      label {
        font-size: 16px;
      }

      select {
        width: 100%;
        font-size: 14px;
        padding: 10px;
      }
    }

    .development-table,
    .milestone-table {
      font-size: 12px;

      th, td {
        padding: 8px;
      }
    }

    .pdf-button {
      font-size: 16px;
      padding: 12px 24px;
    }
  }


  .milestone-item {
    margin-bottom: 15px;
    padding: 10px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .milestone-item h3 {
    font-size: 18px;
    margin: 0;
    color: #333;
  }

  .milestone-item p {
    font-size: 14px;
    color: #555;
  }

  .button-group {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;

    .edit-btn, .delete-btn {
      padding: 8px 15px;
      font-size: 14px;
      border: none;
      cursor: pointer;
      border-radius: 5px;
      background-color: #ffc107;
      color: white;
    }

    .delete-btn {
      background-color: #dc3545;
    }

    .edit-btn:hover, .delete-btn:hover {
      opacity: 0.8;
    }
  }


  .no-records {
    text-align: center;
    margin-top: 20px;
    font-size: 16px;
    color: #777;
  }

  .add-development-btn,
  .edit-development-btn {
    padding: 12px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .add-development-btn:hover,
  .edit-development-btn:hover {
    background-color: #0056b3;
  }
}

</style>
