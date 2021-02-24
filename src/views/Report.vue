<template>
  <div>
    <div class="container is-max-widescreen">
      <h3>Employee Attendance Report</h3>
      <div class="report-box columns">
        <div class="column is-5">
          <b-field>
            <p class="">Employees:</p>

            <b-dropdown
              aria-role="list"
              v-model="selectedEmployeeName"
              scrollable
              max-height="300px"
              @active-change="fetchEmployees"
            >
              <button class="button is-primary" slot="trigger">
                <span>{{ selectedEmployeeName }}</span>

                <img class="" src="../assets/imgs/Arrow 1.png" alt="" />
              </button>
              <b-dropdown-item class="loading" v-show="empsLoading">
                <b-loading
                  :is-full-page="false"
                  v-model="empsLoading"
                ></b-loading
              ></b-dropdown-item>
              <div v-for="employee in employees" :key="employee.id">
                <b-dropdown-item
                  :value="employee.name"
                  aria-role="listitem"
                  @click="setSelectedEmployeeId(employee.id)"
                  >{{ employee.name }}</b-dropdown-item
                >
              </div>
            </b-dropdown>
          </b-field>
        </div>

        <div class="column is-5">
          <b-field>
            <p>Select The Dates:</p>

            <b-datepicker
              ref="datepicker"
              placeholder="d/m/y"
              locale="en-GB"
              v-model="dates"
              :min-date="minDate"
              :max-date="maxDate"
              range
              editable
              icon-next=""
              icon-prev=""
              @input="dateFormatter"
            >
            </b-datepicker>
            <b-button
              class="calendar-icon"
              @click="$refs.datepicker.toggle()"
              type="is-light"
            >
              <img src="../assets/imgs/calendar.png" alt="" />
            </b-button>
          </b-field>
        </div>

        <div class="column has-text-right btn-col">
          <b-button
            class="calc-btn"
            type=""
            @click="fetchReport"
            v-show="!isLoading"
            >Calculate</b-button
          >

          <b-button loading v-show="isLoading" class="calc-btn"
            >Loading</b-button
          >
        </div>
      </div>
    </div>

    <report-summary
      v-if="isAttendanceDataNotEmpty"
      :summary="getReportWithoutAttendancesData()"
    ></report-summary>

    <report-table
      class="tble"
      v-if="isAttendanceDataNotEmpty"
      :attendancesDays="getAttendanceDays()"
    ></report-table>
  </div>
</template>

<script>
import axios from "axios";
import { isEmpty, cloneDeep } from "lodash";
import ReportSummary from "@/components/ReportSummary";
import ReportTable from "@/components/ReportTable";
export default {
  components: { ReportSummary, ReportTable },
  data() {
    return {
      selectedEmployeeName: "Select Employee",
      selectedEmployeeId: 0,
      employees: [],
      minDate: new Date(2016, 5, 1),
      maxDate: new Date(),
      dates: [],
      dateStart: "",
      dateEnd: "",
      attendancesData: {},
      isLoading: false,
      empsLoading: false,
    };
  },

  computed: {
    isAttendanceDataNotEmpty: function () {
      if (isEmpty(this.attendancesData)) {
        return false;
      }
      return true;
    },
  },

  methods: {
    setSelectedEmployeeId: function (id) {
      this.selectedEmployeeId = id;
    },

    dateFormatter: function () {
      //m-d-y
      //there can be better ways to format dates.

      this.monthStart = this.dates[0].getMonth() + 1;
      this.dayStart = this.dates[0].getDate();
      this.yearStart = this.dates[0].getFullYear();

      this.monthEnd = this.dates[1].getMonth() + 1;
      this.dayEnd = this.dates[1].getDate();
      this.yearEnd = this.dates[1].getFullYear();

      this.dateStart =
        this.monthStart + "-" + this.dayStart + "-" + this.yearStart;
      this.dateEnd = this.monthEnd + "-" + this.dayEnd + "-" + this.yearEnd;

      console.log("From: " + this.dateStart + " To: " + this.dateEnd);
    },

    getReportWithoutAttendancesData: function () {
      this.summaryData = cloneDeep(this.attendancesData);
      delete this.summaryData["report"]["attendances"];
      return this.summaryData;
    },

    getAttendanceDays: function () {
      return this.attendancesData.report.attendances;
    },

    fetchEmployees: function () {
      this.empsLoading = true;

      if (this.employees.length == 0) {
        this.$auth.getTokenSilently().then((token) => {
          const headers = { headers: { Authorization: `Bearer ${token}` } };

          axios
            .get(
              "https://attendance-reports-app.herokuapp.com/employees",
              headers
            )
            .then((response) => (this.employees = response.data.employees))
            .then(setTimeout(() => (this.empsLoading = false), 500));
        });
      } else {
        this.empsLoading = false;
      }
    },

    fetchReport: function () {
      if (
        this.selectedEmployeeId != 0 &&
        this.dateStart != "" &&
        this.dateEnd != ""
      ) {
        this.isLoading = true;

        this.$auth.getTokenSilently().then((token) => {
          const headers = { headers: { Authorization: `Bearer ${token}` } };

          axios
            .get(
              "https://attendance-reports-app.herokuapp.com/employees/" +
                this.selectedEmployeeId +
                "/attendances?schedule=true&start_date=" +
                this.dateStart +
                "&end_date=" +
                this.dateEnd,
              headers
            )
            .then((response) => (this.attendancesData = response.data))
            .then(setTimeout(() => (this.isLoading = false), 500));
        });
      } else if (this.selectedEmployeeId == 0 && this.dateStart != "") {
        this.$buefy.toast.open({
          message: "Select an employee to proceed",
          type: "is-danger",
        });
      } else if (this.dateStart == "" && this.selectedEmployeeId != 0) {
        this.$buefy.toast.open({
          message: "Select dates to proceed",
          type: "is-danger",
        });
      } else {
        this.$buefy.toast.open({
          message: "You didn't select any data yet",
          type: "is-danger",
        });
      }
    },
  },
};
</script>


<style scoped lang="scss">
@import "~bulma/sass/utilities/_all";

$primary: #358ef1;
$datepicker-header-color: #4b4848;
// $datepicker-background-color: green;

::v-deep {
  // Import Bulma and Buefy styles
  @import "~bulma";
  @import "~buefy/src/scss/buefy";
}

.container {
  margin-top: 50px;
}
.report-box {
  width: 100%;
  height: 100%;
  background: #ffffff;
  box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding-left: 18px;
}

.report-box p {
  display: inline-block;
  font-weight: 500;
  font-size: 17px;
  color: #358ef1;
  margin-right: 20px;
  margin-top: auto;
  margin-bottom: auto;
  text-align: center;
}

.is-primary,
::v-deep .input {
  background: rgba(0, 0, 0, 0.05) !important;
  border-radius: 3px;
  color: #4b4848;
  width: 170%;
  margin-top: 5px;
  margin-bottom: 0;
  border: none;
}

::v-deep .input {
  padding-right: 0;
}
.is-primary span,
::v-deep .input::placeholder {
  font-family: Inter !important;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  color: #4b4848;
}

::v-deep .datepicker .datepicker-header {
  border-bottom: none;
}

::v-deep .datepicker .datepicker-header .pagination-previous,
::v-deep .datepicker .datepicker-header .pagination-next {
  padding: 0px;
}

::v-deep .datepicker .datepicker-header .pagination-previous span,
::v-deep .datepicker .datepicker-header .pagination-next span {
  color: $primary !important;
  // width: 50%;

  background-image: url("../assets/imgs/prev.png");
}

::v-deep .datepicker .datepicker-header .pagination-previous span {
  background-image: url("../assets/imgs/prev.png");
}

::v-deep .datepicker .datepicker-header .pagination-next span {
  background-image: url("../assets/imgs/next.png");
}

.is-primary img {
  margin-left: auto;
}
.dropdown-menu a {
  font-family: Inter !important;
  font-weight: 500;
  color: #4b4848;
}
.dropdown .is-active {
  color: white;
  background: #358ef1;
}
.btn-col {
  padding: 0;
}
.calc-btn {
  background: #358ef1 !important;
  border-radius: 0px 8px 8px 0px !important;
  text-align: center;
  font-family: Inter;

  color: white !important;
  text-align: center;
  font-weight: 600;
  font-size: 19px;
  line-height: 21px;
  border: none;

  padding: 0 1.5em;
  height: 100% !important;
}

.calendar-icon {
  border: none;
  background: $primary;
  color: white;
  border-radius: 0;
  margin-top: 5px;
}
.loading {
  padding: 20px;
}
.loading ::v-deep.loading-overlay .loading-background {
  background: white !important;
}

.loading ::v-deep.loading-overlay .loading-icon::after {
  height: 1em !important;
  width: 1em !important;
  left: -9px !important;
}
</style>