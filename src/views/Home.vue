<template>
  <div>
    <v-btn @click.stop="addDialog = true" elevation="3" fab fixed bottom right color="red darken-3" dark>
      <v-icon>mdi-pencil-plus</v-icon>
    </v-btn>
    <v-app-bar elevation="2" class="" color="red darken-3" dark>
      <v-layout justify-space-between>
        <p class="text-h5 mb-0">My Calendar</p>
        <v-btn @click.prevent="logout" text small>
          Log-out
          <v-icon small class="ml-2"> mdi-logout </v-icon>
        </v-btn>
      </v-layout>
    </v-app-bar>
    <v-container>
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="64">
            <v-toolbar flat>
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small> mdi-chevron-left </v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small> mdi-chevron-right </v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right> mdi-menu-down </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'day'">
                    <v-list-item-title>Day</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>Week</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>Month</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = '4day'">
                    <v-list-item-title>4 days</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-sheet>
          <v-sheet height="600">
            <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="events"
              :event-color="getEventColor"
              :type="type"
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
            ></v-calendar>
            <!-- <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
              <v-card color="grey lighten-4" min-width="350px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-btn icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon>
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <span v-html="selectedEvent.details"></span>
                </v-card-text>
                <v-card-actions>
                  <v-btn text color="secondary" @click="selectedOpen = false"> Cancel </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu> -->
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>

    <!--- MODAL --->
    <v-dialog v-model="addDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5"> New Event </v-card-title>
        <v-card-text class="pb-0"> All fields are required </v-card-text>
        <v-form ref="form" @submit.prevent="createEvent" class="">
          <div class="px-7">
            <v-select hide-details="auto" :items="colors" v-model="data.color" label="Select Color"></v-select>
            <v-text-field class="" hide-details="auto" type="text" v-model="data.name" :rules="required" label="Event Name" required></v-text-field>
            <v-datetime-picker dateIcon="mdi-calendar" dateFormat="yyyy-mm-dd hh:mm" label="Select Date and Time" v-model="data.start"> </v-datetime-picker>
          </div>
          <v-card-actions class="pb-4 pt-3 px-4">
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="addDialog = false"> Cancel </v-btn>
            <v-btn type="submit" color="green darken-1" text> Save </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!--- UPDATE x VIEW MODAL --->
    <v-dialog v-model="updateDialog" max-width="400">
      <v-card color="">
        <v-toolbar :color="selectedEvent.color" dark>
          <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <!-- <v-card-title class="text-h5"> {{ selectedEvent.name }} </v-card-title> -->
        <v-card-text class="text-caption mt-4"> All fields are required </v-card-text>
        <v-form ref="form" @submit.prevent="updateEvent" class="">
          <div class="px-7">
            <v-select hide-details="auto" :items="colors" v-model="selectedEvent.color" label="Select Color"></v-select>
            <v-text-field class="" hide-details="auto" type="text" v-model="selectedEvent.name" :rules="required" label="Event Name" required></v-text-field>
            <v-datetime-picker dateIcon="mdi-calendar" dateFormat="yyyy-mm-dd hh:mm" label="Select Date and Time" v-model="selectedEvent.start"> </v-datetime-picker>
          </div>
          <v-card-actions class="pb-4 pt-3 px-4">
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="updateDialog = false"> Cancel </v-btn>
            <v-btn color="red darken-1" text @click="deleteEvent"> Delete </v-btn>
            <v-btn type="submit" color="green darken-1" text> Save </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!--- Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="2500" :color="snackcolor">
      {{ snackmsg }}
    </v-snackbar>
  </div>
</template>
<script>
  import { v4 as uuidv4 } from 'uuid';

  export default {
    data: () => ({
      data: {
        id: '',
        name: '',
        color: '',
        start: '',
        user_email: '',
        timed: false,
      },
      snackmsg: '',
      snackbar: false,
      snackcolor: '',
      required: [(v) => !!v || 'This field is required'],
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: { id: null, name: null, start: null },
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      addDialog: false,
      updateDialog: false,
      authenticatedUser: null,
    }),
    mounted() {
      this.$refs.calendar.checkChange();
      this.authenticatedUser = JSON.parse(localStorage.getItem('authenticated'));
      this.data.user_email = this.authenticatedUser.email;
      this.getEvents();
    },
    methods: {
      async logout() {
        localStorage.removeItem('authenticated');
        this.$router.push('/');
      },
      async createEvent() {
        const validated = this.$refs.form.validate();
        if (!validated) return;

        // console.log(this.data);
        this.data.id = uuidv4();
        const res = await this.$localdb.collection('events').add(this.data);

        if (res.success) {
          this.data.name = '';
          this.data.start = '';
          this.$refs.form.resetValidation();
          this.getEvents();
          this.addDialog = false;
          this.showSnackBar('Event created successfully!', 'success');
        }
      },
      async updateEvent() {
        const res = await this.$localdb.collection('events').doc({ id: this.selectedEvent.id }).set(this.selectedEvent);

        if (res.success) {
          this.data.name = '';
          this.data.start = '';
          this.$refs.form.resetValidation();
          this.getEvents();
          this.updateDialog = false;
          this.showSnackBar('Event updated successfully!', 'success');

        }
      },
      async deleteEvent() {
        const res = await this.$localdb.collection('events').doc({ id: this.selectedEvent.id }).delete();

        if (res.success) {
          this.data.name = '';
          this.data.start = '';
          this.$refs.form.resetValidation();
          this.getEvents();
          this.updateDialog = false;
          this.showSnackBar('Event has been deleted successfully!', 'error');

        }
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
      async getEvents() {
        await this.$localdb
          .collection('events')
          .get()
          .then((event) => {
            const filteredEvents = event.filter((event) => event.user_email == this.authenticatedUser.email);
            console.log(filteredEvents);
            // console.log(event)
            this.events = filteredEvents;
            // event && this.events.push(event);
          });
      },
      viewDay({ date }) {
        this.focus = date;
        this.type = 'day';
      },
      getEventColor(event) {
        return event.color;
      },
      setToday() {
        this.focus = '';
      },
      prev() {
        this.$refs.calendar.prev();
      },
      next() {
        this.$refs.calendar.next();
      },
      showEvent({ nativeEvent, event }) {
        this.selectedEvent = { ...event };
        this.updateDialog = true;
        nativeEvent.stopPropagation();
      },
      updateRange({ start, end }) {
        // const events = [];
        // const min = new Date(`${start.date}T00:00:00`);
        // const max = new Date(`${end.date}T23:59:59`);
        // const days = (max.getTime() - min.getTime()) / 86400000;
        // const eventCount = this.rnd(days, days + 20);
        // for (let i = 0; i < eventCount; i++) {
        //   const allDay = this.rnd(0, 3) === 0;
        //   const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        //   const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        //   const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        //   const second = new Date(first.getTime() + secondTimestamp);
        //   events.push({
        //     name: this.names[this.rnd(0, this.names.length - 1)],
        //     start: first,
        //     end: second,
        //     color: this.colors[this.rnd(0, this.colors.length - 1)],
        //     timed: !allDay,
        //   });
        // }
        // this.events = events;
      },
      rnd(a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a;
      },
    },
  };
</script>
