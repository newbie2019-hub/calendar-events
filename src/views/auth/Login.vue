<template>
  <v-container fill-height class="bg-hero">
    <v-layout class="justify-center" fill-height align-center>
      <v-card class="px-10 py-8" width="100%" max-width="460" elevation="0">
        <p class="text-h4 mb-0">Welcome, User!</p>
        <p class="text-caption grey--text">Please enter your credentials to proceed to your account.</p>
        <v-form ref="form" @submit.prevent="login">
          <v-text-field class="mt-4" hide-details="auto" type="email" v-model="data.email" :rules="emailRule" label="Email Address" required></v-text-field>
          <v-text-field class="mt-4" hide-details="auto" type="password" v-model="data.password" :rules="nameRule" label="Password" required></v-text-field>
          <p class="mt-3">Don't have an account? <router-link to="/register" class="text-decoration-none">Register</router-link></p>
          <v-layout justify-end class="mt-6">
            <v-btn type="submit" color="green" text>Login Account</v-btn>
          </v-layout>
        </v-form>
      </v-card>
    </v-layout>
    <!--- Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="3200" :color="snackcolor" class="mb-10">
      {{ snackmsg }}
    </v-snackbar>
  </v-container>
</template>
<script>
  export default {
    data: () => ({
      data: {
        email: '',
        password: '',
      },
      snackcolor: '',
      snackbar: '',
      snackmsg: '',
      emailRule: [(v) => !!v || 'Email Address is required', (v) => /.+@.+/.test(v) || 'Email must be valid'],
      nameRule: [(v) => !!v || 'Full Name is required', (v) => v.length <= 30 || 'Name must be less than 30 characters'],
    }),
    methods: {
      async login() {
        const validated = this.$refs.form.validate();
        if (!validated) return;
        await this.$localdb
          .collection('users')
          .doc({
            email: this.data.email,
            password: this.data.password,
          })
          .get()
          .then((user) => {
            if (user) {
              localStorage.setItem('authenticated', JSON.stringify(user));
              this.showSnackBar('Login Successful!');
              this.$router.push('/home');
            }
            else {
             this.showSnackBar('Account doesn\'t exist', 'error')
            }
          });
      },
      showSnackBar(msg, type = '') {
        switch (type) {
          case 'success':
            this.snackcolor = 'green darken-1';
            break;
          case 'error':
            this.snackcolor = 'red darken-1';
            break;
          default:
            this.snackcolor = 'blue darken-1';
            break;
        }
        this.snackbar = true;
        this.snackmsg = msg;
      },
    },
  };
</script>

<style>
  .bg-hero {
    background-color: #b71c1c;
  }
</style>
