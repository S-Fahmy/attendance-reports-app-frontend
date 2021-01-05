<template>
  <div class="schedule-container">
    <div class="columns">
      <div class="column is-2 is-offset-4">
        <h1>
          Schedule: <span>{{ sch.title }}</span>
        </h1>
      </div>
      <div class="column">
        <b-button type="is-text" size="small" @click="confirmEdit"
          ><img src="@/assets/imgs/check.png" alt=""></b-button>

        <b-button class="edit-btns" type="is-text" size="" @click="cancelEdit"
          ><img src="@/assets/imgs/cancel.png" alt=""></b-button >
      </div>
    </div>
    <div class="columns schedule-body">
      <div class="column with-border is-flex">
        <div class="c1wrapper">
          <h5>Shift time:</h5>
          <div class="columns is-multiline has-text-centered time-column">
            <div class="column">
              <b-timepicker v-model="shift_begins" inline></b-timepicker>
              <span>to</span>
            </div>
            <div class="column">
              <b-timepicker v-model="shift_ends" inline></b-timepicker>
            </div>
          </div>
          <h5>
            Shift duration: <span>{{ timeDiff }} Hours</span>
          </h5>
        </div>
      </div>

      <div class="column with-border">
        <h5 class="rulesh">Rules:</h5>
        <h5>Clock in time interval:</h5>

        <div class="columns is-multiline has-text-centered time-column">
          <div class="column">
            <b-timepicker v-model="clock_in_start" inline></b-timepicker>
            to
            <b-timepicker v-model="clock_in_end" inline></b-timepicker>
          </div>
        </div>

        <h5>Clock out time interval:</h5>
        <div class="columns is-multiline has-text-centered time-column">
          <div class="column">
            <b-timepicker v-model="clock_out_start" inline></b-timepicker>
            to
            <b-timepicker v-model="clock_out_end" inline></b-timepicker>
          </div>
        </div>
        <div class="columns has-text-left input-column">
          <div class="column is-6 is-flex">
            <h5>Allowed early leaves:</h5>
          </div>
          <div class="column is-3">
            <b-field>
              <b-input
                placeholder="0-120 minutes"
                type="number"
                min="0"
                max="120"
                validation-message="Enter a valid number of minutes between 0-120 minutes."
                v-model.number="sch.allowed_early_leave"
              >
              
              </b-input>
            </b-field> 
          </div>
        </div>

        <div class="columns has-text-left input-column">
          <div class="column is-6 is-flex">
            <h5>Allowed Late arrivals:</h5>
          </div>
          <div class="column is-3">
            <b-field>
              <b-input
                placeholder="0-120 minutes"
                type="number"
                min="0"
                max="120"
                validation-message="Enter a valid number of minutes between 0-120 minutes."
                v-model.number="sch.allowed_late_arrival"
              >
              </b-input>
            </b-field>
          </div>
        </div>

        <div class="columns is-multiline has-text-left input-column">
          <div class="column is-6 is-flex">
            <h5>Missing Check penalty:</h5>
          </div>

          <div class="column is-6">
            <b-dropdown
              class="penalty-options"
              aria-role="list"
              v-model="missing_check_penalty_choice"
              @change="ifIsTimePenalty"
            >
              <button
                class="button is-primary"
                slot="trigger"
                slot-scope="{ active }"
              >
                <span>{{ getPenaltyStatus }}</span>
                <b-icon :icon="active ? 'arrow-up' : 'arrow-down'"></b-icon>
              </button>

              <b-dropdown-item value="A"
                >Count As Absent & display reason in the report</b-dropdown-item
              >
              <b-dropdown-item value="timePenalty"
                >Time Penalty & display reason in the report</b-dropdown-item
              >
              <b-dropdown-item value="0">Display Only</b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="column is-3">
            <b-field v-if="isTimePenalty">
              <b-input
                placeholder="time penalty in minutes, 5-360 mins"
                type="number"
                min="5"
                max="360"
                validation-message="enter a valid time in mintes, maximum 7 hours"
                v-model.number="timePenalty"
              >
              </b-input>
            </b-field>
          </div>
        </div>
      </div>
      <div class="column last-col">
        <div class="columns">
          <div class="column is-4 px-0">
            <h5>Assign to:</h5>
          </div>
          <div class="column px-0 py-0">
            <ul>
              <b-dropdown
                v-model="selectedEmployeesIds"
                multiple
                aria-role="list"
                inline
                max-height="700"
              >
                <b-dropdown-item
                  aria-role="listitem"
                  v-for="emp in employees"
                  :key="emp.id"
                  :value="emp.id"
                >
                  <span>{{ emp.name }}</span>
                </b-dropdown-item>
              </b-dropdown>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { cloneDeep } from "lodash";
import moment from "moment";

export default {
  props: {
    schedule: Object,
    allemployees: Array,
    timeNow: Date
  },
  data() {
    return {
      sch: {},
      employees: this.allemployees,
      selectedEmployeesIds: [],

      shift_begins: null,
      shift_ends: null,
      clock_in_start: null,
      clock_in_end: null,
      clock_out_start: null,
      clock_out_end: null,

      missing_check_penalty_choice: "",
      isTimePenalty: false,
      timePenalty: 0,
    };
  },

  computed: {
    timeDiff: function () {
      if(this.shift_begins != null){
       return ((this.shift_ends.getTime() - this.shift_begins.getTime()) /(1000 * 60 * 60));
      }

      return 0;
    },

    getPenaltyStatus: function () {
      if (this.missing_check_penalty_choice == "A") {
        return "Absence";
      } else if (this.missing_check_penalty_choice == "0") {
        return "Display Only";
      }

      return this.timePenalty + " mins of penalty";
    },
  },

  mounted() {
    //getting a deep copy of the schedule prop object because this object is passed down from the parent by reference. i might need to read more about that.
    this.sch = cloneDeep(this.schedule);

    //here i'm mostly initialize original schedule values and formatting/presenting them correctly to show up in the corresponding input forms.

    //need the time to be in a Date format so the b-time can read them
    //then when im about to presist them ill format them to 24hrs string format for the backend.
    this.shift_begins = this.timeStringToDate(this.sch.shift_begins);
    this.shift_ends = this.timeStringToDate(this.sch.shift_ends);
    this.clock_in_start = this.timeStringToDate(this.sch.clock_in_start);
    this.clock_in_end = this.timeStringToDate(this.sch.clock_in_end);
    this.clock_out_start = this.timeStringToDate(this.sch.clock_out_start);
    this.clock_out_end = this.timeStringToDate(this.sch.clock_out_end);

    //if the schedule missing check penalty is time penalty then its bigger than 0
    // if its equal to 0 then its do nothing or equal to 'A' which is abscence, both correspond to the the values of the dropdown already.
    if (
      this.sch.missing_check_penalty != "A" &&
      parseInt(this.sch.missing_check_penalty) > 0
    ) {
      this.missing_check_penalty_choice = "timePenalty"; //for the dropdown preselected choice.
      this.isTimePenalty = true; //to show up the input box.
      this.timePenalty = this.sch.missing_check_penalty; // to preset the value in the input box
    } else {
      this.missing_check_penalty_choice = this.sch.missing_check_penalty; //for the dropdown preselected choice.
    }

    //loop through the selected emps array in the schedule object and fetch only the ids and add them to the temporary array.
    this.sch.assigned_employees.forEach((employee) => {
      this.selectedEmployeesIds.push(employee.id);
    });
  },

  methods: {
    timeStringToDate(time) {
      return moment(time, "hh:mm:ss").toDate();
    },

    timeDateToString24(time) {
      return moment(time).format("HH:mm");
    },
    confirmEdit: function () {
      //inject the selected employees ids array in the sch object and ready up the 24hrs string time formats.
      //Note: the integrity of the time intervals and checks are validated on the backend.

      this.sch.assigned_employees = this.selectedEmployeesIds;
      this.sch.shift_begins = this.timeDateToString24(this.shift_begins);
      this.sch.shift_ends = this.timeDateToString24(this.shift_ends);

      this.sch.clock_in_start = this.timeDateToString24(this.clock_in_start);
      this.sch.clock_in_end = this.timeDateToString24(this.clock_in_end);
      this.sch.clock_out_start = this.timeDateToString24(this.clock_out_start);
      this.sch.clock_out_end = this.timeDateToString24(this.clock_out_end);

      if (this.isTimePenalty) {
        this.sch.missing_check_penalty = "" + this.timePenalty;
      } else {
        //"A" or "0"
        this.sch.missing_check_penalty = this.missing_check_penalty_choice;
      }

      axios
        .patch("https://attendance-reports-app.herokuapp.com/schedules", { data: this.sch })
        .then((response) => this.$emit("editedDone", response.data.schedule));
    },

    cancelEdit: function () {
      this.$emit("cancelEdit");
    },

    ifIsTimePenalty(value) {
      if (value == "timePenalty") {
        this.isTimePenalty = true;
      } else {
        this.isTimePenalty = false;
        // this.timePenalty = 0
      }
    },
  },
};
</script>

<style scoped>
.schedule-container .penalty-options ::v-deep.dropdown-menu {
  background: white;
  padding: 20px;
  font-size: 0.9em;
  box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.05);
}
.schedule-container .penalty-options ::v-deep.dropdown-item {
  font-size: 1em;
  font-family: Inter;
  color: #4b4848;
  margin: 0px;
}

.schedule-container .penalty-options ::v-deep.is-active {
  padding: 5px 20px !important;
}

.schedule-container .input-column {
  padding: 0px;
  margin: 0 0 25px 0;
}

.schedule-container .input-column .column {
  padding: 0px;
  margin: auto 0;
}

.schedule-container .button.is-primary {
  background: #358ef1;
  font-family: Inter;
  font-weight: 400 !important;
  font-size: 0.9em;
}

.schedule-container .button.is-primary:hover {
  background-color: #4b4848;
}

.schedule-container .time-column .column {
  padding: 0 !important;
}

.schedule-container ::v-deep.dropdown-item {
  padding-bottom: 0px;
}
.last-col ul {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
}
* {
  scrollbar-width: thin;
  scrollbar-color: #358ef1 #4b4848;
}
.schedule-container ::v-deep.dropdown-content {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0px !important;
}

.schedule-container ::v-deep.control {
  font-size: 1rem !important;
  color: #358ef1 !important;
}

.schedule-container ::v-deep.control select {
  color: #358ef1 !important;
  font-family: Inter !important;
  font-weight: 500 !important;
}

.schedule-container ::v-deep.control select:focus {
  /* border: 2px solid #4b4848 !important; */
  color: #4b4848 !important;
}

.schedule-container ::v-deep.control .is-colon {
  margin-top: 1px !important;
  color: #358ef1 !important;
}

.schedule-container ::v-deep.dropdown-item {
  margin-bottom: 20px;
  font-size: 15px;
  line-height: 19px;

  color: rgba(75, 72, 72, 0.86);

  border-bottom: 1px solid rgba(75, 72, 72, 0.15);
  padding: 10px 0 10px 0;
}

.schedule-container ::v-deep.dropdown-content .is-active {
  background: #358ef1 !important;
  border-radius: 5px;
  padding-left: 20px;
  color: white;
}

/*  */

.schedule-container {
  background: #ffffff;
  box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 50px;
  padding-bottom: 0px;
  margin-bottom: 50px;
}

.schedule-container .column {
  padding-left: 1.75rem;
  padding-bottom: 50px;
}
.with-border {
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}

.ass-col {
  margin: auto 0;
}

h1 {
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  /* identical to box height */
  margin-bottom: 50px;
  color: #4b4848 !important;
}

h1 span {
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  /* identical to box height */

  color: #358ef1;
}

h5 {
  font-weight: 600;
  font-size: 15px;
  line-height: 21px;
  /* identical to box height */

  margin-bottom: 25px;
  color: rgba(75, 72, 72, 0.87);
}

h5 span {
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 19px;

  color: #4b4848;
}
.rulesh {
  text-align: left !important;
  margin-bottom: 25px;
}
.c1wrapper {
  margin: auto 0 !important;
}

/* chrome and edge scrollbar */
*::-webkit-scrollbar {
  width: 8px !important;
}

*::-webkit-scrollbar-track {
  background: #4b4848;
}

*::-webkit-scrollbar-thumb {
  background-color: #358ef1;
  border-radius: 20px;
  border: none;
}
</style>