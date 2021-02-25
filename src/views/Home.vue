<template>
  <div v-if="!$auth.loading" class="home container">
    <div v-if="!$auth.isAuthenticated" class="columns is-multiline">
      <div class="column is-12">
        <h1>Welcome!</h1>
      </div>
      <div class="column is-11 is-offset-1">
        <!-- show login when not authenticated -->
        <b-tooltip
          position="is-bottom"
          label="Demo version credentials: you can register or use the default uname: test@test.com | pswd: Test12345"
          type="is-info"
        >
          <b-button v-if="!$auth.isAuthenticated" type="is-info" @click="login"
            >Log in/ Register</b-button
          >
        </b-tooltip>
      </div>
    </div>

    <div v-if="$auth.isAuthenticated" class="columns is-multiline">
      <div
        class="column is-4-desktop is-12-tablet has-text-centered-tablet has-text-left-desktop"
      >
        <h1>Welcome...</h1>
        <h2>What do you need to do?</h2>
      </div>
      <!-- <div v-if="!$auth.loading">
        <div
          v-if="!$auth.isAuthenticated"
          class="column left-tile is-3-desktop is-offset-2-tablet is-4-tablet"
        >
          <b-button type="is-info" @click="login">Log in/ Register</b-button>
        </div>
      </div> -->

      <div
        class="column left-tile is-3-desktop is-offset-2-tablet is-4-tablet"
        v-if="$auth.isAuthenticated"
      >
        <div class="columns is-multiline">
          <div class="column is-12">
            <b-button type="is-info" tag="router-link" to="/Report"
              >Calculate an Employee Report</b-button
            >
          </div>
          <div class="column is-12 bottom-btns">
            <b-button tag="router-link" to="/schedules" type="is-info">
              View and manage Schedules</b-button
            >
          </div>
        </div>
      </div>
      <div class="column is-3-desktop is-4-tablet" v-if="$auth.isAuthenticated">
        <div class="columns is-multiline">
          <div class="column is-12">
            <b-tooltip
              label="component unavailable on the demo version"
              type="is-dark"
            >
              <b-button type="is-info">View Employees</b-button>
            </b-tooltip>
          </div>
          <div class="column is-12 bottom-btns">
            <b-tooltip
              label="component unavailable on the demo version"
              type="is-dark"
            >
              <b-button class="" type="is-info "
                >Import data from fingerprint machine</b-button
              >
            </b-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "Home",
  components: {
    // HelloWorld
  },
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
    },
    // // Log the user out
    // logout() {
    //   this.$auth.logout({
    //     returnTo: window.location.origin,
    //   });
    // },
  },
};
</script>


<style scoped>
.home {
  position: absolute;
  right: 0;
  left: 0;
  top: 45%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* max-width: 75% !important; */
}
h1 {
  background-image: linear-gradient(
      90.34deg,
      rgba(171, 171, 171, 0.3) 10.83%,
      rgba(255, 255, 255, 0) 70.65%
    ),
    linear-gradient(0deg, rgba(75, 72, 72, 0.9), rgba(75, 72, 72, 0.9));

  background-clip: text;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;

  font-weight: 800;
  font-size: 3.5rem;
  line-height: 67px;
}

h2 {
  background-image: linear-gradient(
      90.19deg,
      rgba(171, 171, 171, 0.25) 3.31%,
      rgba(255, 255, 255, 0) 55.89%
    ),
    linear-gradient(0deg, rgba(75, 72, 72, 0.8), rgba(75, 72, 72, 0.8));

  background-clip: text;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;

  font-weight: 800;
  font-size: 1.8rem;
  line-height: 42px;
  margin-top: 54px;
}

.left-tile .button {
  background: linear-gradient(
    90.03deg,
    #5aa4f7 19.67%,
    #358ef1 74.03%
  ) !important;
}

.button {
  font-family: Inter !important;
  font-style: normal !important;
  border-radius: 44px !important;
  padding: 14px 25px !important;
  text-align: center !important;
  font-weight: 500 !important;
  font-size: 1rem !important;
  color: white !important;
  background: #358ef1 !important;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05) !important;
  /* border: none; */
}

.bottom-btns {
  margin-top: 15%;
}
</style>
