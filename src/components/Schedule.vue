<template>
  <div>
    <div class="schedule-container" v-show="!editing">
      <div class="columns">
        <div class="column is-3 is-offset-3">
          <h1>
            Schedule: <span>{{ sch.title }}</span>
          </h1>
        </div>
        <div class="column">
          <b-button type="is-text" size="small" @click="edit"
            ><img src="@/assets/imgs/pencil.png" alt=""
          /></b-button>
          <b-button type="is-text" size="small" @click="remove"
            ><img src="@/assets/imgs/trash.png" alt=""
          /></b-button>
        </div>
      </div>
      <div class="columns schedule-body">
        <div class="column with-border is-flex">
          <div class="c1wrapper">
            <h5>
              Shift time:
              <span
                >{{ formatTimeString24toAmPm(sch.shift_begins) }} to
                {{ formatTimeString24toAmPm(sch.shift_ends) }}</span
              >
            </h5>
            <h5>Shift duration: <span>7 hours</span></h5>
          </div>
        </div>

        <div class="column with-border">
          <h1 class="rulesh">Rules:</h1>
          <h5>
            Clock in time interval:
            <span
              >{{ formatTimeString24toAmPm(sch.clock_in_start) }} to
              {{ formatTimeString24toAmPm(sch.clock_in_end) }}</span
            >
          </h5>
          <h5>
            Clock out time interval:
            <span
              >{{ formatTimeString24toAmPm(sch.clock_out_start) }} to
              {{ formatTimeString24toAmPm(sch.clock_out_end) }}</span
            >
          </h5>

          <h5>
            Allowed early leaves:

            <span>{{ minOrMins(sch.allowed_early_leave) }}</span>
          </h5>
          <h5>
            Allowed Late arrivals:
            <span>{{ minOrMins(sch.allowed_late_arrival) }}</span>
          </h5>
          <h5>
            Missing Check penalty:
            <span>{{ getPenaltyMessage(sch.missing_check_penalty) }}</span>
          </h5>
        </div>
        <div class="column last-col">
          <div class="columns">
            <div class="column is-4 px-0">
              <h5>Assigned to:</h5>
            </div>
            <div class="column px-0 py-0">
              <ul>
                <li v-for="emp in sch.assigned_employees" :key="emp.id">
                  {{ emp.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="editing" v-if="editing">
      <schedule-edit
        v-bind:schedule="sch"
        v-bind:allemployees="emps"
        @cancelEdit="edit"
        @editedDone="editConfirmed"
      ></schedule-edit>
    </div>
  </div>
</template>

<script>
import ScheduleEdit from "@/components/ScheduleEdit";
import moment from "moment";
import axios from "axios";

export default {
  components: { ScheduleEdit },
  props: {
    schedule: Object,
    emps: Array,
  },

  data() {
    return {
      sch: this.schedule,
      editing: false,
    };
  },

  methods: {
    getPenaltyMessage(penalty) {
      // Display& -{{ sch.missing_check_penalty }} minutes
      if (penalty == "A") {
        return "Count as absent, Display reason in report.";
      } else if (penalty == "0") {
        return "Dispaly in report only.";
      } else {
        return penalty + " minutes penalty.";
      }
    },

    minOrMins(time) {
      if (time > 0) {
        return time + " minutes";
      }

      return time + " minute";
    },

    edit: function () {
      this.editing = !this.editing;
    },

    remove() {

      //buefy dialog
      
      this.$buefy.dialog.confirm({
        title: "Removing schedule",
        message: "Are you sure?",
        confirmText: "Remove",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () =>
          axios
            .delete("https://attendance-reports-app.herokuapp.com/schedules/" + this.sch.id)
            .then(this.$emit("deleted", this.sch.id)),
      });
    },

    formatTimeString24toAmPm: function (time) {
      return moment(time, "HH:mm:ss").format("h:mm a");
    },

    editConfirmed(value) {
      this.sch = value;
      this.editing = false;

      this.$buefy.toast.open({
        message: "Schedule edited!",
        type: "is-success",
      });
    },
  },
};
</script>

<style scoped>
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

.last-col ul {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  padding: 20px;
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #358ef1 #4b4848;
}
.last-col ul li {
  margin-bottom: 20px;
  font-size: 15px;
  line-height: 19px;

  color: rgba(75, 72, 72, 0.86);

  border-bottom: 1px solid rgba(75, 72, 72, 0.15);
  padding-bottom: 20px;
}

.last-col ul li:last-child {
  border-bottom: none;
  padding-bottom: 0px;
}

/* chrome and edge scrollbar */
.last-col ul::-webkit-scrollbar {
  width: 8px !important;
}

.last-col ul::-webkit-scrollbar-track {
  background: #4b4848;
}

.last-col ul::-webkit-scrollbar-thumb {
  background-color: #358ef1;
  border-radius: 20px;
  border: none;
}
</style>