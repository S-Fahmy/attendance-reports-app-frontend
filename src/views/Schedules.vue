<template>
  <div class="container">
    <b-button
      class="add-schedule"
      size=""
      @click="newSchedule"
      :icon-left="iconName"
    >
      {{ getAddBtnText }}
    </b-button>
    <b-button
      class="add-schedule"
      icon-left="plus-circle"
      size=""
      @click="addSchedule"
      v-if="addingSchedule"
    >
      Add
    </b-button>
    <b-button
      class="view-holidays"
      size=""
      tag="router-link"
      :to="{ path: '/holidays' }"
    >
      View Holidays
    </b-button>
    <div
      v-if="schedules.length > 0 || addingSchedule"
      class="schedules-wrapper"
    >
      <schedule-add
        v-if="addingSchedule"
        :employees="employees"
        ref="addRef"
        @added="pushNewSchedule"
      ></schedule-add>

      <div v-for="schedule in schedules" :key="schedule.id">
        <schedule
          :schedule="schedule"
          :emps="employees"
          @deleted="removeSchedule"
        ></schedule>
      </div>
    </div>
  </div>
</template>

<script>
import Schedule from "@/components/Schedule";
import ScheduleAdd from "@/components/ScheduleAdd";
import axios from "axios";
import { reject } from "lodash";

export default {
  components: { Schedule, ScheduleAdd },

  data() {
    return {
      schedules: [],
      employees: [], //TODO: later if this app ever gets big move this to a vuex state.
      addingSchedule: false,
    };
  },

  computed: {
    getAddBtnText() {
      if (this.addingSchedule) {
        return "Cancel";
      }
      return "Add Schedule";
    },

    iconName() {
      if (this.addingSchedule) {
        return "minus-circle";
      }

      return "plus-circle";
    },
  },

  mounted: function () {
    this.$auth.getTokenSilently().then((token) => {
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      axios
        .get("https://attendance-reports-app.herokuapp.com/schedules", headers)
        .then((response) => (this.schedules = response.data.schedules));

      axios
        .get("https://attendance-reports-app.herokuapp.com/employees", headers)
        .then((response) => (this.employees = response.data.employees));
    });
  },

  methods: {
    newSchedule() {
      this.addingSchedule = !this.addingSchedule;
    },

    addSchedule() {
      this.$refs.addRef.addTheSchedule();
    },

    pushNewSchedule(value) {
      console.log(value);
      this.schedules.unshift(value);
      this.addingSchedule = false;

      this.$buefy.toast.open({
        message: "Schedule added!",
        type: "is-success",
      });
    },
    removeSchedule(value) {
      //lodash way of returning the array without the deleted object
      this.schedules = reject(this.schedules, function (el) {
        return el.id === value;
      });

      this.$buefy.toast.open({
        message: "Schedule Deleted!",
        type: "is-success",
      });
    },
  },
};
</script>

<style>
.add-schedule {
  background: #358ef1;
  box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.15) !important;
  border-radius: 0px 8px 8px 0px;
  margin: 50px 0;

  font-family: Inter !important;
  font-style: normal;
  font-weight: 500 !important;
  font-size: 16px !important;
  line-height: 19px;
  color: white;
  padding-top: 22px;
  padding-bottom: 22px;
}

.view-holidays {
  margin: 50px 0;
  margin-left: 50px;

  background: transparent;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-decoration: underline;

  color: #358ef1;
  border: none;
}

.schedules-wrapper {
  margin-bottom: 50px !important;
}
</style>