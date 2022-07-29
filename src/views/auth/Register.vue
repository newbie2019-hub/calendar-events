<template>
  <v-container fill-height class="bg-hero">
    <v-layout class="justify-center" fill-height align-center>
      <v-card class="px-10 py-8" width="100%" max-width="460" elevation="0">
        <p class="text-h4 mb-0">Welcome, User!</p>
        <p class="text-caption grey--text">We need some of your informations to proceed for the registration.</p>
        <v-form ref="form" @submit.prevent="register">
          <v-text-field class="mt-4" hide-details="auto" v-model="data.full_name" :rules="nameRule" label="Full Name" required></v-text-field>
          <v-text-field class="mt-4" hide-details="auto" type="email" v-model="data.email" :rules="emailRule" label="Email Address" required></v-text-field>
          <v-text-field class="mt-4" hide-details="auto" type="password" v-model="data.password" :rules="nameRule" label="Password" required></v-text-field>
          <p class="mt-4">Already have an account? <router-link to="/" class="text-decoration-none">Login</router-link></p>
          <v-layout justify-end class="mt-6">
            <v-btn type="submit" color="green" text>Register</v-btn>
          </v-layout>
        </v-form>
      </v-card>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    data: () => ({
      data: {
        full_name: '',
        email: '',
        password: '',
      },
      emailRule: [(v) => !!v || 'Email Address is required', (v) => /.+@.+/.test(v) || 'Email must be valid'],
      nameRule: [(v) => !!v || 'Full Name is required', (v) => v.length <= 30 || 'Name must be less than 30 characters'],
    }),
    methods: {
      async register() {
        const validated = this.$refs.form.validate();
        if (!validated) return;
        const res = await this.$localdb.collection('users').add(this.data);

        if (res.success) {
          this.data.full_name = '';
          this.data.email = '';
          this.data.password = '';
          this.$refs.form.resetValidation();
        }
      },
    },
  };
</script>

