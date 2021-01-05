<template>
  <div class="container summary-container">
    <div class="summary-header has-text-centered">
      <h5>
        Attendance Report for: <span>{{ summary.employee.name }}</span>
      </h5>
      <h5>
        from: <span>{{ formatDateStringMdyToDmy(summary.start_date) }}</span> To
        <span>{{ formatDateStringMdyToDmy(summary.end_date) }}</span>
      </h5>
      <h5>
        Active Schedule:
        <span class="schtitle">{{ summary.report.schedule_title }}</span> Shift
        Time
        <span
          >{{ formatTimeString24toAmPm(summary.report.shift_begins) }} to
          {{ formatTimeString24toAmPm(summary.report.shift_ends) }}</span
        >
      </h5>
    </div>
    <hr />
    <div class="summary-body">
      <div class="columns">
        <div class="column">
          <h5>
            Days attended:
            <span>{{ dayOrDays(summary.attended_days_count) }}</span>
          </h5>
          <h5>
            Days Absent:
            <span>{{ dayOrDays(summary.report.total_absent_days) }}</span>
          </h5>
          <h5>
            Days missing a fingerprint check:
            <span>{{ dayOrDays(summary.report.days_without_checks) }}</span>
          </h5>
        </div>

        <div class="column">
          <!-- <h5>Total Hours Worked: <span>{{Math.round(summary.report.total_work_time/60)}} hours</span></h5> -->
          <h5>
            Total Hours Worked:
            <span
              >{{ getHoursMinutesFromMintes(summary.report.total_work_time) }}</span
            >
          </h5>

          <h5>
             Late/Early Arrival Total:
            <span>{{ summary.report.arrival_total}} minutes</span>
          </h5>
          <h5>
             OverTime/UnderTime Leave Total:
            <span>{{ summary.report.leave_total }} minutes</span>
          </h5>
        </div>

        <div class="column total-col">
          <h5>
            {{ overOrUnder() }} Total:
            <span :class="{ undertime: !isOverTime, overtime: isOverTime }"
              >{{ getFinalTotal() }} minutes</span
            >
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    summary: Object,
  },

  data() {
    return {
      isOverTime: false,
    };
  },

  computed: {},
  methods: {
    getHoursMinutesFromMintes: function(mins){
      this.time = mins/60;
      this.hour = Math.floor(this.time);
      this.minute = Math.round((this.time % 1) * 60);
      console.log(Math.round(this.hour))

      return this.hour + "hrs & " + this.minute + "mins";
    },

    formatDateStringMdyToDmy: function (date) {
      return moment(date, "MM-DD-YYYY").format("D/M/YYYY");
    },

    formatTimeString24toAmPm: function (time) {
      return moment(time, "HH:mm:ss").format("h:mm a");
    },

    dayOrDays: function (num) {
      if (num > 1) {
        return num + " days";
      }

      return num + " day";
    },
    overOrUnder: function () {
      if (this.summary.report.overtime > 0) {
        this.isOverTime = true;
        return "OverTime";
      }
      this.isOverTime = false;
      return "UnderTime";
    },
    getFinalTotal: function () {
      if (
        this.summary.report.overtime == 0 &&
        this.summary.report.undertime == 0
      ) {
        return 0;
      }

      if (this.isOverTime) {
        return "+ " + this.summary.report.overtime;
      } else {
        return this.summary.report.undertime;
      }
    },
  },
};
</script>

<style scoped>
.summary-container {
  margin-top: 62px !important;
  margin-bottom: 50px !important;
  padding: 50px;
  background: #ffffff;
  box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.summary-container h5 {
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 25px;
  color: #4b4848;
}

.summary-container h5 span {
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  color: rgba(75, 72, 72, 0.75);
}

.schtitle {
  margin-right: 30px;
}

.summary-container .summary-body {
  margin-top: 50px;
}

.overtime {
  font-weight: 900 !important;
  color: #22d73f !important;
}

.undertime {
  font-weight: 900 !important;
  color: #d40532 !important;
}

.total-col {
  margin: auto 0;
}

hr {
  background-color: rgba(0, 0, 0, 0.1) !important;
}
</style>