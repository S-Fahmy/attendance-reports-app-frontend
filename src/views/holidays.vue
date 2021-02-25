<template>
  <div class="container is-max-desktop">
    <div class="columns my-6 is-multiline">
      <div class="column is-3 mx-5">
        <b-tooltip
          position="is-bottom"
          label="component unavailable on the demo version"
          type="is-dark"
        >
          <b-button type="">Resync with google Calendar</b-button>
        </b-tooltip>
      </div>

      <div class="column">
        <b-tooltip
          position="is-bottom"
          label="component unavailable on the demo version"
          type="is-dark"
        >
          <b-button type="">Manually add holiday</b-button>
        </b-tooltip>
      </div>
    </div>
    <div class="holidays-wrapper">
      <b-table
        :data="holidays"
        :columns="columns"
        paginated="true"
        per-page="10"
      ></b-table>
      <!-- <ul>
            <li v-></li>
        </ul> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      holidays: [],
      columns: [
        {
          field: "name",
          label: "First Name",
        },
        {
          field: "date",
          label: "Date",
        },
      ],
    };
  },

  mounted() {
    this.$auth.getTokenSilently().then((token) => {
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      axios
        .get("https://attendance-reports-app.herokuapp.com/holidays", headers)
        .then((response) => (this.holidays = response.data.holidays));
    });
  },
};
</script>

<style scoped>
.holidays-wrapper {
  margin-top: auto !important;

  background: #ffffff;
  box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 50px;
}

.holidays-wrapper ::v-deep.pagination .is-current {
  background: #358ef1;
  border: 1px solid #ffffff;
}

::v-deep.button {
  background-color: #358ef1 !important;
  color: white;
  font-family: Inter;

  box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.15);
  border-radius: 0px 8px 8px 0px;
  padding: 15px;
}
</style>