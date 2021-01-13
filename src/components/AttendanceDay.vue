<template>
  <div class="container attendance-day-container">
    <div class="columns has-text-centered" v-if="!isAbsent">
      <div class="column">
        <h5 class="text-bold">
          {{ formatDateStringYmdToDmy(attendanceDay.day) }}
        </h5>
      </div>

      <div class="column">
        <h5 :class="{ nocheck: noCheckin() }">
          {{ attendanceDay.checkin_status }}
        </h5>
      </div>

      <div class="column">
        <h5 class="text-bold">
          {{ formatTimeString24toAmPm(attendanceDay.checkin) }}
        </h5>
      </div>

      <div class="column">
        <h5>{{ attendanceDay.check_in_calculation }} <span>minutes</span></h5>
      </div>

      <div class="column">
        <h5 :class="{ nocheck: noCheckout() }">
          {{ attendanceDay.checkout_status }}
        </h5>
      </div>

      <div class="column">
        <h5 class="text-bold">
          {{ formatTimeString24toAmPm(attendanceDay.checkout) }}
        </h5>
      </div>

      <div class="column">
        <h5>{{ attendanceDay.check_out_calculation }} <span>minutes</span></h5>
      </div>
      <div class="column">
        <h5>
          {{ formatTime(attendanceDay.total_attendance_time) }}
          <span>hours</span>
        </h5>
      </div>
      <div class="column">
        <h5
          class="text-bold"
          :class="{
            bad: attendanceDay.has_or_owes < 0,
            good: attendanceDay.has_or_owes > 0,
          }"
        >
          {{ attendanceDay.has_or_owes }} <span>minutes</span>
        </h5>
        <b-tooltip label="Edit this day" position="is-right" animated
          ><a class="edit-day"><img src="../assets/imgs/pencil.png" alt="" /></a
        ></b-tooltip>
      </div>
    </div>

    <!-- absent day -->

    <div class="columns absent-day" v-if="isAbsent">
      <div class="column">
        <h5 class="text-bold">{{ absenceDay }}</h5>
      </div>
      <div class="column reason">
        <h5>{{ attendanceDay.absence_reason }}</h5>
        <b-tooltip label="Edit this day" position="is-right" animated
          ><a class="edit-day"><img src="../assets/imgs/pencil.png" alt="" /></a
        ></b-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    day: Object,
  },

  data() {
    return {
      attendanceDay: this.day,

      absent: false,
      absenceDay: "",
    };
  },

  mounted: function () {
    // if (this.attendanceDay.absent) {
    //   console.log(this.day.day);
    //   this.absenceDay = this.formatDateStringYmdToDmy(this.day.day);
    //   this.absent = true;
    // }
  },

  computed: {
    isAbsent() {
      if (this.attendanceDay.absent) {
        return this.setAbsenceDay();
      }

      return false;
    },
  },

  methods: {
    //for computed method
    setAbsenceDay() {
      this.absenceDay = this.formatDateStringYmdToDmy(this.day.day);
      return true;
    },

    formatDateStringYmdToDmy: function (date) {
      return moment(date, "YYYY-MM-DD").format("D/M/YYYY");
    },

    formatTimeString24toAmPm: function (time) {
      if (!moment(time, "HH:mm:ss").isValid()) {
        return "No time.";
      }
      return moment(time, "HH:mm:ss").format("h:mm a");
    },

    formatTime: function (time) {
      return moment(time, "HH:mm:ss").format("h:m");
    },
    noCheckout: function () {
      if (this.attendanceDay.checkout_status == "Didn't clock out") {
        return true;
      }
    },

    noCheckin: function () {
      if (this.attendanceDay.checkin_status == "Didn't clock in") {
        return true;
      }
    },
  },
};
</script>

<style scope>
.attendance-day-container {
  background: #ffffff;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);

  padding: 22px 20px;
  margin-bottom: 7px !important;
}
.attendance-day-container:hover {
  background: rgba(255, 255, 255, 0.65);
}

.absent-day h5 {
  margin-left: 2%;
}

.absent-day .reason h5 {
  color: #d40532;
  font-weight: 700;
  font-size: 17px;
}

.attendance-day-container h5 {
  font-weight: normal;
  font-size: 0.9375rem !important;
  line-height: 19px;
  color: #4b4848;
}

.attendance-day-container h5 span {
  font-size: 0.7rem !important;
  font-weight: 400 !important;
}
.attendance-day-container .text-bold {
  font-weight: 600 !important;
}
.attendance-day-container .b-tooltip {
  position: absolute !important;
  display: inline-block !important;
  left: 99.3%;
  top: 36%;
  /* width: 170% !important; */
}
.attendance-day-container img {
  max-width: 185% !important;
}

.attendance-day-container .tooltip-content {
  background: #358ef1 !important;
}

.bad {
  color: #d40532 !important;
}

.good {
  color: #22d73f !important;
}

.attendance-day-container .nocheck {
  font-weight: 600;
  color: orangered !important;
}
</style>