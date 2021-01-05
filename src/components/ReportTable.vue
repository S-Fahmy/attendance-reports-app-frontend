<template>
  <div class="tble">
    <div class="container report-tble-container">
      <div class="columns table-header has-text-centered">
        <div class="column"><h5>Day</h5></div>

        <div class="column"><h5>Checkin Status</h5></div>

        <div class="column"><h5>Checkin Time</h5></div>

        <div class="column"><h5>Late/Early by</h5></div>

        <div class="column"><h5>Checkout Status</h5></div>

        <div class="column"><h5>Checkout Time</h5></div>

        <div class="column"><h5>Late/Early by</h5></div>
        <div class="column"><h5>Total Work hours</h5></div>
        <div class="column">
          <b-tooltip
            label="OT = OverTime | UT = UnderTime"
            position="is-top"
            type="is-dark"
            animated
            ><h5>OT/UT Total</h5></b-tooltip
          >
        </div>
      </div>
    </div>

    <div v-for="attDay in attendancesDays" :key="attDay.id">
      <attendance-day :day="attDay"></attendance-day>
    </div>
  </div>
</template>

<script>
import AttendanceDay from "@/components/AttendanceDay.vue";
export default {
  components: { AttendanceDay },
  props: {
    attendancesDays: Array,
  },
};
</script>

<style scope>

.tble{
  margin-bottom: 50px !important;
}
.report-tble-container .table-header {
  background: #358ef1;
  border-radius: 8px 8px 0px 0px;
  padding: 15px;
  margin: 0 !important;
}

.table-header h5 {
  font-family: Inter;
  font-weight: 500 !important;
  font-size: .9rem !important;
  line-height: 22px;
  /* identical to box height */

  color: #ffffff;
}
</style>