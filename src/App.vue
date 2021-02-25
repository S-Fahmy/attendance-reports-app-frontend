<template>
  <div id="app">
    <b-navbar v-show="!onHome" centered class="mainBar">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img src="@/assets/imgs/logo.png" alt="IST Attendance system" />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item
          :class="{ 'is-active': onReport }"
          tag="router-link"
          :to="{ path: '/report' }"
        >
          Reports
        </b-navbar-item>
        <b-navbar-item
          :class="{ 'is-active': onSchedules }"
          tag="router-link"
          :to="{ path: '/schedules' }"
        >
          Schedules
        </b-navbar-item>
        
        <b-navbar-item href="#"> <b-tooltip position = "is-bottom" label="component unavailable on the demo version" type="is-dark"> Employees </b-tooltip></b-navbar-item>
        <b-navbar-item v-if="$auth.isAuthenticated" class="logoutbtn" @click="logout"
          >Log out</b-navbar-item
        >
      </template>
    </b-navbar>

    <b-navbar centered v-show="onHome">
      <template slot="start">
        <b-navbar-item class="main_title"
          >IST Industries Attendance App</b-navbar-item
        >

        <!-- show logout when authenticated -->
        <b-navbar-item v-if="$auth.isAuthenticated"  @click="logout" class="logoutbtn"
          >Log out</b-navbar-item
        >
      </template>
    </b-navbar>

    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  computed: {
    onHome() {
      return this.$route.name === "Home";
    },

    onReport() {
      return this.$route.name === "Report";
    },

    onSchedules() {
      return this.$route.name === "Schedules";
    },

    routeName() {
      return this.$route.name;
    },
  },
  methods: {
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin,
      });
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

html {
  height: 100%;
}

body {
  background-color: #eeecec !important;
  min-height: 100vh;
  height: auto !important;
}
#app {
  font-family: "Inter", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #4b4848 !important;
}

.navbar {
  min-height: 5rem !important;
  background: #f5f3f3 !important;
}
.mainBar a.navbar-item {
  font-weight: 500;
  font-size: 18px;
  margin-right: 40%;
  color: #4b4848;
}

.mainBar a.navbar-item:hover {
  color: #4b4848;
}

.mainBar a.navbar-item:focus {
  color: #4b4848;
}

.main_title {
  font-weight: 500;
  font-size: 25px;
  color: rgba(53, 142, 241, 0.75) !important;
}

.mainBar .is-active {
  border-bottom: 4px solid #358ef1;
  color: #358ef1 !important;
}

h3 {
  font-weight: 600 !important;
  font-size: 20px !important;

  color: #4b4848 !important;
  margin-bottom: 50px !important;
}

.logoutbtn{
  color: #358ef1 !important;
  font-size: 12px !important;
  margin-left: 50px;
}
</style>
