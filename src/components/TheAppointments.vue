<script lang="ts">
import {Appointment} from "@/models/Appointment";
import {CreateAppointmentResource} from "@/models/CreateAppointmentResource";
import {UpdateAppointmentResource} from "@/models/UpdateAppointmentResource";
import moment from "moment/moment";

export default {
  data() {
    return {
      apiBaseUrl: 'http://localhost:8080/api',
      appointments: [] as Array<Appointment>,
      createAppointmentResource: {projectId: this.projectId} as CreateAppointmentResource,
      updateAppointmentResource: {projectId: this.projectId} as UpdateAppointmentResource,
      appointmentId: String,
      updateFormVisible: false,
      isVisible: false
    }
  },
  mounted() {
    console.log(this.projectId);
    this.fetchAppointments()
  },
  methods: {
    fetchAppointments() {
      fetch(`${this.apiBaseUrl}/appointments/${this.projectId}`)
          .then(response => response.json())
          .then((data: Array<Appointment>) => this.appointments = data)
    }, createAppointment() {
      fetch(`${this.apiBaseUrl}/appointments/`, {
        method: 'POST',
        body: JSON.stringify(this.createAppointmentResource),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            this.fetchAppointments()
            this.createAppointmentResource = {projectId: this.projectId} as CreateAppointmentResource
          })
    },
    save() {
      this.createAppointment()
    },
    deleteAppointment(id: string) {
      fetch(`${this.apiBaseUrl}/appointments/${id}`, {
        method: 'DELETE'
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to delete appointment');
            }
            return response.json();
          })
          .then(() => {
            console.log('Appointment deleted successfully')
          })
          .catch(error => {
            console.error('Error deleting appointment:', error);
          })
          .then(() => this.fetchAppointments());
    }, setAppointment(appointment: Appointment) {
      this.appointmentId = appointment.id;
      this.updateFormVisible = true;
      this.updateAppointmentResource = appointment;
    }, updateAppointment() {
      fetch(`${this.apiBaseUrl}/appointments/${this.appointmentId}`, {
        method: 'PUT',
        body: JSON.stringify(this.updateAppointmentResource),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            this.updateAppointmentResource = {projectId: this.projectId} as UpdateAppointmentResource;
            this.updateFormVisible = false;
            this.fetchAppointments();
          })
          .catch(error => {
            console.error('Error:', error);
          });
    }, formatDate(date: string, formatPattern = 'DD. MM. YYYY') {
      return moment(date).format(formatPattern);
    }, formatTime(time: string) {
      return time.substring(0, 5);
    }, toggleModal() {
      this.isVisible = !this.isVisible;
    }
  },
  props: ['projectId']
}
</script>

<template>
  <div class="container">
    <div class="button-wrapper">
      <button @click="toggleModal()">New Appointment</button>
    </div>

    <div class="overlay" :class="isVisible ? 'visible' : ''"></div>
    <div class="form-container" :class="isVisible ? 'visible' : ''">
      <form>
        <div class="form-control">
          <label for="date">Date</label>
          <input type="date" name="date" id="date" v-model="createAppointmentResource.date">
        </div>
        <div class="form-control">
          <label for="startingTime">Starting Time</label>
          <input type="time" name="startingTime" id="startingTime" v-model="createAppointmentResource.startingTime">
        </div>
        <div class="form-control">
          <label for="endingTime">Ending Time</label>
          <input type="time" name="endingTime" id="endingTime" v-model="createAppointmentResource.endingTime">
        </div>
        <div class="form-control">
          <label for="type">Type</label>
          <select name="type" id="type" v-model="createAppointmentResource.type">
            <option value="PROBE">Rehearsal</option>
            <option value="KONZERT">Concert</option>
            <option value="GENERALPROBE">General Rehearsal</option>
            <option value="BESPRECHUNG">Meeting</option>
            <option value="STIMMTERMINE">Tuning</option>
            <option value="ANSPIELPROBE">Warmup Rehearsal</option>
          </select>
        </div>
        <div class="form-control">
          <label for="location">Location</label>
          <input type="text" name="location" id="location" v-model="createAppointmentResource.location">
        </div>
        <div class="form-control">
          <label for="status">Status</label>
          <div class="display-grid">

            <input type="radio" name="status" id="confirmed" value="CONFIRMED"
                   v-model="createAppointmentResource.status">
            <label for="confirmed">Confirmed</label>
          </div>
          <div class="display-grid">

            <input type="radio" name="status" id="notConfirmed" value="NOT_CONFIRMED"
                   v-model="createAppointmentResource.status">
            <label for="notConfirmed">Not Confirmed</label>

          </div>
        </div>
        <div class="form-control button-field">
          <button @click.prevent="save()">Save</button>
          <button @click.prevent="toggleModal()">Close</button>
        </div>
      </form>
    </div>


    <table v-show="appointments.length > 0" class="table table-hover">
      <thead>
      <tr>
        <th scope="col">Date</th>
        <th scope="col">Hours</th>
        <th scope="col">Type</th>
        <th scope="col">Location</th>
        <th scope="col">Status</th>
        <th scope="col"></th>
        <th scope="col"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="appointment in appointments" v-bind:key="appointment.id">

        <td> {{ formatDate(appointment.date) }}</td>
        <td> {{ formatTime(appointment.startingTime) }} - {{ formatTime(appointment.endingTime) }}</td>
        <td v-if="appointment.type === 'KONZERT'">Concert</td>
        <td v-else-if="appointment.type === 'PROBE'">Rehearsal</td>
        <td v-else-if="appointment.type === 'GENERALPROBE'">General Rehearsal</td>
        <td v-else-if="appointment.type === 'BESPRECHUNG'">Meeting</td>
        <td v-else-if="appointment.type === 'ANSPIELPROBE'">Warmup Rehearsal</td>
        <td v-else>Tuning</td>
        <td> {{ appointment.location }}</td>
        <td v-if="appointment.status === 'CONFIRMED'"><img src="../components/icons/confirmed-icon.png" width="20"
                                                           height="20"
                                                           title="Appointment confirmed" alt="Appointment confirmed">
        </td>
        <td v-else><img src="../components/icons/questionmark-icon.png" width="20" height="20"
                        title="Appointment not confirmed" alt="Appointment not confirmed"></td>

        <td>
          <button @click.prevent="setAppointment(appointment)" class="round-button"><img
              src="../components/icons/edit-icon.png" width="20px" height="20px"
              title="Update Appointment"></button>
        </td>
        <td>
          <button @click="deleteAppointment(appointment.id)" class="round-button"><img
              src="../components/icons/delete-icon.png" width="20px" height="20px"
              title="Delete Appointment"></button>
        </td>
      </tr>
      </tbody>
    </table>


    <div class="overlay" :class="updateFormVisible ? 'visible' : ''"></div>
    <div class="form-container" :class="updateFormVisible ? 'visible' : ''">
      <form>
        <div class="form-control">
          <label for="updateDate">Date</label>
          <input type="date" name="updateDate" id="updateDate" v-model="updateAppointmentResource.date">
        </div>
        <div class="form-control">
          <label for="updateStartingTime">Starting Time</label>
          <input type="time" name="updateStartingTime" id="updateStartingTime"
                 v-model="updateAppointmentResource.startingTime">
        </div>
        <div class="form-control">
          <label for="updateEndingTime">Ending Time</label>
          <input type="time" name="updateEndingTime" id="updateEndingTime"
                 v-model="updateAppointmentResource.endingTime">
        </div>
        <div class="form-control">
          <label for="updateType">Type</label>
          <select name="updateType" id="updateType" v-model="updateAppointmentResource.type">
            <option value="PROBE">Rehearsal</option>
            <option value="KONZERT">Concert</option>
            <option value="GENERALPROBE">General Rehearsal</option>
            <option value="BESPRECHUNG">Meeting</option>
            <option value="STIMMTERMINE">Tuning</option>
            <option value="ANSPIELPROBE">Warmup Rehearsal</option>
          </select>
        </div>
        <div class="form-control">
          <label for="updateLocation">Location</label>
          <input type="text" name="updateLocation" id="updateLocation" v-model="updateAppointmentResource.location">
        </div>
        <div class="form-control">
          <label for="updateStatus">Status</label>
          <div class="display-grid">
            <input type="radio" name="updateStatus" id="confirmed" value="CONFIRMED"
                   v-model="updateAppointmentResource.status">
            <label for="confirmed">Confirmed</label>
          </div>
          <div class="display-grid">
            <input type="radio" name="updateStatus" id="notConfirmed" value="NOT_CONFIRMED"
                   v-model="updateAppointmentResource.status">
            <label for="notConfirmed">Not Confirmed</label>
          </div>
        </div>
        <div class="form-control button-field">
          <button @click.prevent="updateAppointment()">Save</button>
          <button @click.prevent="this.updateFormVisible = false">Close</button>
        </div>
      </form>
    </div>
  </div>


</template>

<style scoped lang="scss">
$gradientBlue: linear-gradient(45deg, #1b047a, #3168eb, #94f0f5, rgba(158, 231, 244, 0));
$gradientDarkBlue: linear-gradient(45deg, #1b047a, #3168eb);
$darkBlue: rgb(17, 9, 92);
$backgroundBlue: #3168eb;
$warmWhite: #faf6ee;

.container {
  margin-top: 5rem;
  margin-bottom: 2rem;
  padding: 1rem .5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $warmWhite;
  border-radius: 25px;

  .button-wrapper {
    background: $warmWhite;
    margin-top: -35px;
    margin-bottom: 2rem;
    width: fit-content;
    padding: 8px;
    align-items: center;
    background: $warmWhite;
    border-radius: 25px;

    button {
      padding: 8px 2rem;
      background: $backgroundBlue;
      border-radius: 25px;
      border-style: none;
      font-size: 20px;
      color: $warmWhite;
      font-weight: bold;
      transition: ease-in-out 0.3s;

      &:hover {
        color: #ffffff;
        background: rgb(20, 5, 140);
      }
    }
  }

  .overlay {
    position: absolute;
    width: 100vw;
    height: 200vh;
    top: 0;
    left: 0;
    right: auto;
    bottom: auto;
    background: rgba(0, 0, 0, .3);
    transition: all ease-in-out .3s;
    z-index: 8;
    opacity: 0;
    visibility: hidden;

    &.visible {
      visibility: visible;
      opacity: 1;
    }
  }

  .form-container {
    transform: translateY(-65rem);
    z-index: 9;
    position: absolute;
    max-width: 400px;
    width: 100%;
    padding: 1rem;
    background: $warmWhite;
    box-shadow: 0 0 15px rgba(150, 150, 150, .4);
    border-radius: 10px;
    left: 50%;
    margin-left: calc(400px / -2);
    display: flex;
    justify-content: center;
    align-content: center;
    transition: all ease-in-out .3s;

    &.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(-20rem);
    }

    .form-control {
      width: 300px;

      input {
        width: 100%;
      }

      label {
        margin-bottom: 0;
        display: block;
        font-size: 13px;
      }

      .display-grid {
        margin-top: 4px;
        padding-right: 5px;
        display: grid;
        grid-template-columns: 14px 1fr;
        gap: 10px;
      }
    }

    .button-field {
      padding: 8px 5rem;
      display: flex;
      justify-content: space-between;

      button {
        width: 65px;
        padding: 5px;
        background-color: $backgroundBlue;
        border: none;
        border-radius: 25px;
        color: #ffffff;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

}
</style>