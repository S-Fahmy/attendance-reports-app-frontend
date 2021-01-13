<template>
  <div class="schedule-container">
    <div class="columns">
      <div class="column is-2 is-offset-3">
        <h1>
          Schedule title:
          </h1>
      </div>
      <div class="column is-2">
          <b-input
            placeholder="name"
            validation-message="enter a suitable name"
            v-model="newSchedule.title"
          ></b-input>
        
      </div>
    </div>

    <div class="columns schedule-body">
      <div class="column with-border is-flex">
        <div class="c1wrapper">
          <h5>Shift time:</h5>
          <div class="columns is-multiline has-text-centered time-column">
            <div class="column">
              <b-timepicker
                v-model="newSchedule.shift_begins"
                inline
              ></b-timepicker>
              <span>to</span>
            </div>
            <div class="column">
              <b-timepicker
                v-model="newSchedule.shift_ends"
                inline
              ></b-timepicker>
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
            <b-timepicker
              v-model="newSchedule.clock_in_start"
              inline
            ></b-timepicker>
            to
            <b-timepicker
              v-model="newSchedule.clock_in_end"
              inline
            ></b-timepicker>
          </div>
        </div>

        <h5>Clock out time interval:</h5>
        <div class="columns is-multiline has-text-centered time-column">
          <div class="column">
            <b-timepicker
              v-model="newSchedule.clock_out_start"
              inline
            ></b-timepicker>
            to
            <b-timepicker
              v-model="newSchedule.clock_out_end"
              inline
            ></b-timepicker>
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
                v-model.number="newSchedule.allowed_early_leave"
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
                v-model.number="newSchedule.allowed_late_arrival"
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
              v-model="newSchedule.missing_check_penalty"
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
            <h5>
              Assign to:
              <b-tooltip label="Un/Select all employees" type="is-dark">
                <b-button type="is-text" size="small" @click="selectAllEmps"
                  ><img src="../assets/imgs/plus.png" alt=""
                /></b-button>
              </b-tooltip>
            </h5>
          </div>
          <div class="column px-0 py-0">
            <ul>
              <b-dropdown
                v-model="newSchedule.assigned_employees"
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
import moment from "moment";
import axios from "axios";
export default {
  props: { employees: Array },

  data() {
    return {
      newSchedule: {
        title: "",
        assigned_employees: [],

        shift_begins: moment("9:0 am", "h:m a").toDate(),
        shift_ends: moment("4:0 pm", "h:m a").toDate(),
        clock_in_start: moment("7:0 am", "h:m a").toDate(),
        clock_in_end: moment("1:0 pm", "h:m a").toDate(),
        clock_out_start: moment("1:15 pm", "h:m a").toDate(),
        clock_out_end: moment("11:30 pm", "h:m a").toDate(),

        allowed_early_leave: 0,
        allowed_late_arrival: 0,

        missing_check_penalty: "0",
      },

      isTimePenalty: false,
      timePenalty: 0,

      allEmpsSelected: false,
    };
  },

  computed: {
    timeDiff: function () {
      return (
        (this.newSchedule.shift_ends.getTime() -
          this.newSchedule.shift_begins.getTime()) /
        (1000 * 60 * 60)
      );
    },

    getPenaltyStatus: function () {
      if (this.newSchedule.missing_check_penalty == "A") {
        return "Absence";
      } else if (this.newSchedule.missing_check_penalty == "0") {
        return "Display Only";
      }

      return this.timePenalty + " mins of penalty";
    },
  },

  methods: {
    selectAllEmps() {
      if (!this.allEmpsSelected) {
        this.employees.forEach((emp) => {
          this.newSchedule.assigned_employees.push(emp.id);
        });
        this.allEmpsSelected = true;
      } else {
        // i want to deselect all
        this.newSchedule.assigned_employees.splice(
          0,
          this.newSchedule.assigned_employees.length
        );
        this.allEmpsSelected = false;
      }
    },

    timeDateToString24(time) {
      return moment(time).format("HH:mm");
    },

    ifIsTimePenalty(value) {
      if (value == "timePenalty") {
        this.isTimePenalty = true;
      } else {
        this.isTimePenalty = false;
      }
    },

    addTheSchedule() {
      if (this.isTimePenalty) {
        this.newSchedule.missing_check_penalty = "" + this.timePenalty;
      }

      //format the times to 24hrs string format before sending them to the api.
      this.formatTheTimes();

      //here i can emit with either with the local object i just added here or the shcedule object i get from the response.
      axios
        .post("https://attendance-reports-app.herokuapp.com/schedules", this.newSchedule)
        .then((response) => this.$emit("added", response.data.schedule));
    },

    formatTheTimes() {
      this.newSchedule.shift_begins = this.timeDateToString24(
        this.newSchedule.shift_begins
      );
      this.newSchedule.shift_ends = this.timeDateToString24(
        this.newSchedule.shift_ends
      );

      this.newSchedule.clock_in_start = this.timeDateToString24(
        this.newSchedule.clock_in_start
      );
      this.newSchedule.clock_in_end = this.timeDateToString24(
        this.newSchedule.clock_in_end
      );
      this.newSchedule.clock_out_start = this.timeDateToString24(
        this.newSchedule.clock_out_start
      );
      this.newSchedule.clock_out_end = this.timeDateToString24(
        this.newSchedule.clock_out_end
      );
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