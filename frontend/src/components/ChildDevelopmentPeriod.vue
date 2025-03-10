<template>
  <div class="development-container">
    <h2>Praćenje Razvoja za {{ childName || "Nepoznato dete" }}</h2>

    <!-- Period Selector -->
    <div class="period-selector">
      <h3>Izaberite period:</h3>
      <div class="periods-list">
        <button v-for="period in availablePeriods"
                :key="`${period.start}-${period.end}`"
                :class="getPeriodClass(period)"
                @click="selectPeriod(period)"
                :disabled="isFuturePeriod(period)">
          {{ formatPeriod(period.start, period.end) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  emits: ["period-selected"], 

  data() {
    return {
      childName: null,
      childAge: null,
      availablePeriods: [],
    };
  },

  methods: {
    async fetchChildData(childId) {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/${childId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.childName = response.data.name;
        this.childAge = this.calculateAgeInMonths(response.data.birthDate);
        this.generateAvailablePeriods();
      } catch (error) {
        console.error("❌ Greška pri dobijanju podataka o detetu:", error);
      }
    },

    calculateAgeInMonths(birthDate) {
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

    selectPeriod(period) {
      console.log("🔵 Selected Period:", period);
      this.$emit("period-selected", period);
    },

    formatPeriod(start, end) {
      return `${start}-${end} meseci`;
    },

    getPeriodClass(period) {
      console.log("🔍 Checking Class for:", period);
      if (this.isCurrentPeriod(period)) return "period-button current";
      if (this.isFilledPeriod(period)) return "period-button filled";
      if (this.isFuturePeriod(period)) return "period-button future";
      return "period-button past";
    },

    isCurrentPeriod(period) {
      return this.childAge >= period.start && this.childAge < period.end;
    },

    isFilledPeriod(period) {
      return this.childAge >= period.end;
    },

    isFuturePeriod(period) {
      return this.childAge < period.start;
    }
  },

  async created() {
    const childId = this.$route.params.childId;
    if (childId) {
      await this.fetchChildData(childId);
    }
  }
};
</script>

