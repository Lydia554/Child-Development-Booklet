<template>
  <div class="development-container">
    <h2>Praćenje Razvoja za dete {{ childName || "Nepoznato dete" }}</h2>

    <!-- Child Info -->
    <div class="child-info">
      <h3>{{ childName }}</h3>
      <p><strong>Starost:</strong> {{ childAge ? childAge + " meseci" : "Nepoznata starost" }}</p>
    </div>

    <!-- Period Selector -->
    <div class="period-selector">
      <h3>Izaberite period:</h3>
      <div class="periods-list">
        <button
          v-for="period in availablePeriods"
          :key="`${period.start}-${period.end}`"
          :class="getPeriodClass(period)"
          @click="selectPeriod(period)"
          :disabled="isFuturePeriod(period)">
          {{ formatPeriod(period.start, period.end) }}
          <span v-if="isFilledPeriod(period)">✔ Ispunjeno</span>
          <span v-else-if="isCurrentPeriod(period)">🟢 Trenutni period</span>
          <span v-else-if="isFuturePeriod(period)">🚫 Nedostupan</span>
          <span v-else>❌ Neispunjeno</span>
        </button>
      </div>
    </div>
    

   
    <div v-if="selectedPeriod" class="period-data">
      <h3>Razvoj za period: {{ formatPeriod(selectedPeriod.start, selectedPeriod.end) }}</h3>

      <!-- Development Data -->
      <div v-if="currentPeriodDevelopment" class="development-section">
        <h4>Razvoj deteta</h4>
        <div class="development-details">
          <div class="development-item">
            <h5>Fizički razvoj</h5>
            <p>{{ currentPeriodDevelopment.physicalDevelopment || "Nema podataka" }}</p>
          </div>
          <div class="development-item">
            <h5>Emocionalni razvoj</h5>
            <p>{{ currentPeriodDevelopment.emotionalDevelopment || "Nema podataka" }}</p>
          </div>
          <div class="development-item">
            <h5>Intelektualni razvoj</h5>
            <p>{{ currentPeriodDevelopment.intellectualDevelopment || "Nema podataka" }}</p>
          </div>
          <div class="development-item">
            <h5>Socijalni razvoj</h5>
            <p>{{ currentPeriodDevelopment.socialDevelopment || "Nema podataka" }}</p>
          </div>
          <div class="button-group">
            <button @click="editDevelopment(currentPeriodDevelopment)" class="edit-btn">Izmeni</button>
            <button @click="confirmDeleteDevelopment(currentPeriodDevelopment._id)" class="delete-btn">Obriši</button>
          </div>
        </div>
      </div>

   
      <div v-else>
        <button v-if="!isFilledPeriod(selectedPeriod)" @click="navigateToDevelopmentForm(selectedPeriod)" class="add-development-btn">Dodaj Razvoj</button>
      </div>

      <!-- Milestones -->
      <div v-if="currentPeriodMilestones.length" class="milestones-section">
        <h4>Ključni momenti za ovaj period</h4>
        <div class="milestone-list">
          <div v-for="milestone in currentPeriodMilestones" :key="milestone._id" class="milestone-item">
            <h3>{{ milestone.milestoneType }} - {{ formatDate(milestone.milestoneDate) }}</h3>
            <p><strong>Napredak:</strong> {{ milestone.progress }}</p>
            <p><strong>Napomene:</strong> {{ milestone.notes }}</p>
            <div class="button-group">
              <button @click="editMilestone(milestone)" class="edit-btn">Izmeni</button>
              <button @click="confirmDeleteMilestone(milestone._id)" class="delete-btn">Obriši</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-records">
        <p v-if="!isFilledPeriod(selectedPeriod)">Nema unetih podataka za ovaj period.</p>
        <button v-if="!isFilledPeriod(selectedPeriod)" @click="navigateToDevelopmentForm(selectedPeriod)" class="add-development-btn">Dodaj Razvoj</button>
       
        <button v-if="!currentPeriodMilestones.length" @click="navigateToMilestoneForm" class="add-milestone-btn">Dodaj Ključni Momenat</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

export default {
  data() {
    return {
      childName: null,
      childAge: null,
      developmentData: [],
      milestoneData: [],
      availablePeriods: [],
      selectedPeriod: null,
      childBirthDate: null,
    };
  },

  computed: {
    currentPeriodDevelopment() {
      return this.selectedPeriod
        ? this.developmentData.find(
            (d) =>
              d.startAge === this.selectedPeriod.start &&
              d.endAge === this.selectedPeriod.end
          )
        : null;
    },

    currentPeriodMilestones() {
      if (!this.selectedPeriod) return [];

      const milestones = this.getMilestonesForPeriod(this.selectedPeriod);
      console.log("📢 Current Period Milestones:", milestones);
      return milestones;
    },
  },

  methods: {
    async fetchChildData(childId) {
      try {
        const authStore = useAuthStore();
        const token = authStore.token;
        console.log("🔍 Fetching child data for:", childId);

        const response = await axios.get(`https://child-development-backend.fly.dev/api/${childId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          this.childName = response.data.name;
          this.childAge = this.calculateAgeInMonths(response.data.birthDate);
          this.childBirthDate = response.data.birthDate;
          this.generateAvailablePeriods();
        }
      } catch (error) {
        console.error("❌ Error fetching child data:", error);
      }
    },

    async fetchDevelopmentData(childId) {
      try {
        const authStore = useAuthStore();
        const token = authStore.token;
        console.log("📢 Fetching development data for:", childId);

        const response = await axios.get(
          `https://backend-solitary-wave-1128.fly.dev/api/child-development/${childId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.developmentData = response.data || [];
      } catch (error) {
        console.error("❌ Error fetching development data:", error);
      }
    },

    async fetchMilestones(childId) {
      try {
        const authStore = useAuthStore();
        const token = authStore.token;
        console.log("📢 Fetching milestones for:", childId);

        const response = await axios.get(
          `https://backend-solitary-wave-1128.fly.dev/api/milestones/${childId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.milestoneData = response.data || [];
        console.log("✅ Fetched Milestones:", this.milestoneData);
      } catch (error) {
        console.error("❌ Error fetching milestones:", error);
      }
    },

    getMilestonesForPeriod(period) {
      if (!this.childBirthDate) {
        console.warn("⚠️ Child birth date is missing, cannot filter milestones.");
        return [];
      }

      const birthDate = new Date(this.childBirthDate);
      const startDate = new Date(birthDate);
      startDate.setMonth(startDate.getMonth() + period.start);

      const endDate = new Date(birthDate);
      endDate.setMonth(endDate.getMonth() + period.end);

      console.log(`🔎 Filtering milestones between ${startDate.toISOString()} - ${endDate.toISOString()}`);

      const filteredMilestones = this.milestoneData.filter(milestone => {
        const milestoneDate = new Date(milestone.milestoneDate);
        console.log(`🔍 Checking Milestone: ${milestone.milestoneType} - ${milestoneDate.toISOString()}`);

        return milestoneDate >= startDate && milestoneDate < endDate;
      });

      console.log("📌 Matched Milestones for Period:", filteredMilestones);
      return filteredMilestones;
    },

    calculateStartDate(months) {
      const birthDate = new Date(this.childBirthDate);
      birthDate.setMonth(birthDate.getMonth() + months);
      return birthDate;
    },

    calculateEndDate(months) {
      const birthDate = new Date(this.childBirthDate);
      birthDate.setMonth(birthDate.getMonth() + months);
      return birthDate;
    },

    calculateAgeInMonths(birthDate) {
      if (!birthDate) return 0;
      const birth = new Date(birthDate);
      const now = new Date();
      return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    },

    generateAvailablePeriods() {
      if (this.childAge === null) return;
      this.availablePeriods = [];
      for (let i = 0; i <= 72; i += 6) {
        this.availablePeriods.push({ start: i, end: i + 6 });
      }
    },

    async selectPeriod(period) {
      this.selectedPeriod = period;
      console.log("🔍 Selected Period:", period);

      
      await this.fetchMilestones(this.$route.params.childId);

     
      this.$forceUpdate();
    },

    formatPeriod(start, end) {
      return `${start}-${end} meseci`;
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("sr-RS");
    },

    getPeriodClass(period) {
      if (this.isCurrentPeriod(period)) return "period-button current";
      if (this.isFilledPeriod(period)) return "period-button filled";
      if (this.isFuturePeriod(period)) return "period-button future";
      return "period-button past";
    },

    isCurrentPeriod(period) {
      return this.childAge >= period.start && this.childAge < period.end;
    },

    isFilledPeriod(period) {
      return this.developmentData.some(
        (d) => d.startAge === period.start && d.endAge === period.end
      );
    },

    isFuturePeriod(period) {
      return this.childAge < period.start;
    },

    navigateToDevelopmentForm(period) {
      this.$router.push({
        path: `/child-development-form/${this.$route.params.childId}`,
        query: {
          startAge: period.start,
          endAge: period.end
        }
      });
    },

    navigateToMilestoneForm() {
      this.$router.push({
        path: `/milestone-form/${this.$route.params.childId}`
      });
    },

    async confirmDeleteDevelopment(developmentId) {
      if (window.confirm("Da li ste sigurni da želite da obrišete ove podatke o razvoju?")) {
        await this.deleteDevelopment(developmentId);
      }
    },

    async deleteDevelopment(developmentId) {
      try {
        const authStore = useAuthStore();
        const token = authStore.token;
        const childId = this.$route.params.childId;

        await axios.delete(`http://localhost:5000/api/child-development/${childId}/${developmentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        await this.fetchDevelopmentData(childId);
        await this.fetchMilestones(childId);
      } catch (error) {
        console.error("❌ Error deleting development data:", error);
      }
    },

    editDevelopment(developmentData) {
      if (!developmentData) {
        console.warn("⚠️ No development data available to edit.");
        return;
      }

      console.log("✏️ Editing development:", developmentData);

      this.$router.push({
        path: `/child-development-form/${this.$route.params.childId}`,
        query: {
          startAge: developmentData.startAge,
          endAge: developmentData.endAge
        }
      });
    },

    editMilestone(milestone) {
      if (!milestone) {
        console.warn("⚠️ No milestone data available to edit.");
        return;
      }

      console.log("✏️ Editing milestone:", milestone);

      this.$router.push({
        path: `/milestone-form/${this.$route.params.childId}`,
        query: {
          milestoneId: milestone._id
        }
      });
    },

    async confirmDeleteMilestone(milestoneId) {
      if (window.confirm("Da li ste sigurni da želite da obrišete ovaj ključni trenutak?")) {
        await this.deleteMilestone(milestoneId);
      }
    },

    async deleteMilestone(milestoneId) {
      try {
        const authStore = useAuthStore();
        const token = authStore.token;
        const childId = this.$route.params.childId;

        await axios.delete(`http://localhost:5000/api/milestones/${milestoneId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        await this.fetchMilestones(childId);
        this.$forceUpdate();
      } catch (error) {
        console.error("❌ Error deleting milestone:", error);
      }
    }
  },

  async created() {
    try {
      const childId = this.$route.params.childId;
      if (childId) {
        console.log("🚀 Fetching data for child:", childId);
        await this.fetchChildData(childId);
        await this.fetchDevelopmentData(childId);
        await this.fetchMilestones(childId);
      }
    } catch (error) {
      console.error("❌ Error in created():", error);
    }
  }
};
</script>


<style lang="scss" scoped>
$primary-color: #4caf50;
$primary-hover: #45a049;
$warning-color: #ffcc00;
$warning-hover: #e6b800;
$danger-color: #e74c3c;
$danger-hover: #c0392b;
$background-light: #f8f9fa;
$border-color: #ddd;
$text-color: #333;

.development-container {
  text-align: center;
  padding: 40px;
  max-width: 1000px;
  margin: 0 auto;
}

.child-info {
  background: $background-light;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.period-selector {
  margin-bottom: 30px;
}

.periods-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  justify-content: center;
  max-width: 900px;
  margin: 0 auto;

  button {
    font-size: 18px;
    padding: 20px;
    border-radius: 12px;
    font-weight: bold;
    transition: 0.3s;
    cursor: pointer;
    text-align: center;
    border: none;
    width: 100%;

    &:hover:not(:disabled) {
      transform: scale(1.05);
    }

    &.current {
      background-color: $primary-color;
      color: white;
    }

    &.filled {
      background-color: $warning-color;
      color: black;
    }

    &.future {
      background-color: #cccccc;
      color: white;
      cursor: not-allowed;
    }
  }
}

.period-data {
  margin-top: 30px;
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  text-align: left;

  h3, h4 {
    color: $text-color;
    font-weight: bold;
    margin-bottom: 15px;
    border-bottom: 2px solid $border-color;
    padding-bottom: 10px;
    font-size: 18px;
  }
}

.development-details, .milestone-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.development-item, .milestone-item {
  background-color: $background-light;
  padding: 20px;
  border-radius: 10px;
  border-left: 6px solid #1976d2;
  text-align: left;
  font-size: 22px;
}

.milestone-item {
  border-left: 6px solid #ff9800;
}

.button-group {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 15px;
}

.button-group button {
  padding: 13px 20px;
  font-size: 15px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  width: 100%;
  max-width: 250px;
}

.edit-btn {
  background-color: $warning-color;
  color: black;

  &:hover {
    background-color: $warning-hover;
    transform: scale(1.05);
  }
}

.delete-btn {
  background-color: $danger-color;
  color: white;

  &:hover {
    background-color: $danger-hover;
    transform: scale(1.05);
  }
}

.no-records {
  text-align: center;
  font-style: italic;
  color: #666;
  padding: 20px;
  background: $background-light;
  border-radius: 10px;
  margin-top: 20px;
  
}

.add-development-btn, .edit-development-btn {
  padding: 10px 20px;
  border: none;
  font-size: 16px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
}

.add-development-btn {
  background-color: $primary-color;
  color: white;

  &:hover {
    background-color: $primary-hover;
  }
}

.edit-development-btn {
  background-color: $warning-color;
  color: black;

  &:hover {
    background-color: $warning-hover;
  }
}

.add-milestone-btn {
  background-color: #12b648;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin: 20px;

  &:hover {
    background-color: darken(#0e6302, 10%);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
}

@media (max-width: 768px) {
  .development-container {
    padding: 20px;
  }

  .child-info {
    font-size: 18px;
    padding: 15px;
  }

  .periods-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .button-group {
    flex-direction: column;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .development-container {
    padding: 15px;
  }

  .child-info {
    font-size: 16px;
  }

  .periods-list {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .button-group button {
    font-size: 14px;
    padding: 12px;
  }
}

@media (max-width: 360px) {
  .development-container {
    padding: 10px;
  }

  .child-info {
    font-size: 14px;
    padding: 10px;
  }

  .button-group button {
    font-size: 13px;
    padding: 10px;
  }
}

</style>
