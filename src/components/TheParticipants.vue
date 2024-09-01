<script lang="ts">
import {Participant} from "@/models/Participant";
import {CreateParticipantResource} from "@/models/CreateParticipantResource";
import {UpdateParticipantResource} from "@/models/UpdateParticipantResource";


export default {
  data() {
    return {
      apiBaseUrl: 'http://localhost:8080/api',
      participants: [] as Array<Participant>,
      createParticipantResource: {projectId: this.projectId} as CreateParticipantResource,
      updateParticipantResource: {projectId: this.projectId} as UpdateParticipantResource,
      participantId: String,
      updateFormVisible: false,
      isVisible: false
    }
  },
  mounted() {
    console.log(this.projectId);
    this.fetchParticipants()
  },
  methods: {
    fetchParticipants() {
      fetch(`${this.apiBaseUrl}/participants/${this.projectId}`)
          .then(response => response.json())
          .then((data: Array<Participant>) => this.participants = data)
    }, createParticipant() {
      fetch(`${this.apiBaseUrl}/participants/`, {
        method: 'POST',
        body: JSON.stringify(this.createParticipantResource),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            this.fetchParticipants()
            this.createParticipantResource = {projectId: this.projectId} as CreateParticipantResource
          })
    }, setParticipant(participant: Participant) {
      this.participantId = participant.id;
      this.updateFormVisible = true;
      this.updateParticipantResource = participant;
    }, updateParticipant() {
      fetch(`${this.apiBaseUrl}/participants/${this.participantId}`, {
        method: 'PUT',
        body: JSON.stringify(this.updateParticipantResource),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            this.updateParticipantResource = {projectId: this.projectId} as UpdateParticipantResource;
            this.updateFormVisible = false;
            this.fetchParticipants();
          })
          .catch(error => {
            console.error('Error:', error);
          });
    }, deleteParticipant(id: string) {
      fetch(`${this.apiBaseUrl}/participants/${id}`, {
        method: 'DELETE'
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to delete participant');
            }
            return response.json();
          })
          .then(() => {
            console.log('Participant deleted successfully')
          })
          .catch(error => {
            console.error('Error deleting participant:', error);
          })
          .then(() => this.fetchParticipants());
    }, toggleModal() {
      this.isVisible = !this.isVisible;
    }, save() {
      this.createParticipant()
    }
  }, props: ['projectId']
}

</script>

<template>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  </head>
  <div class="container">
    <div class="button-wrapper">
      <button @click="toggleModal()">New Participant</button>
    </div>


    <div class="overlay" :class="isVisible ? 'visible' : ''"></div>
    <div class="form-container" :class="isVisible ? 'visible' : ''">
      <form>
        <div class="form-control">
          <label for="firstname">First Name</label>
          <input type="text" name="firstname" id="firstname" v-model="createParticipantResource.firstname">
        </div>
        <div class="form-control">
          <label for="lastname">Last Name</label>
          <input type="text" name="lastname" id="lastname" v-model="createParticipantResource.lastname">
        </div>
        <div class="form-control">
          <label for="email">Email</label>
          <input type="email" name="email" id="email" v-model="createParticipantResource.email">
        </div>
        <div class="form-control">
          <label for="phoneNumber">Phone Number</label>
          <input type="text" name="phoneNumber" id="phoneNumber" v-model="createParticipantResource.phoneNumber">
        </div>
        <div class="form-control button-field">
          <button @click.prevent="save()">Save</button>
          <button @click.prevent="toggleModal()">Close</button>
        </div>
      </form>
    </div>

    <table v-if="participants.length > 0" class="table table-hover">
      <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Phone</th>
        <th scope="col"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="participant in participants" v-bind:key="participant.id">
        <td> {{ participant.lastname }}{{ ', ' }} {{ participant.firstname }}</td>
        <td> {{ participant.email }}</td>
        <td> {{ participant.phoneNumber }}</td>
        <td>
          <button @click="setParticipant(participant)" class="round-button"><img src="../components/icons/edit-icon.png"
                                                                                 width="20px" height="20px"
                                                                                 title="Update Participant"></button>
        </td>
        <td>
          <button @click="deleteParticipant(participant.id)" class="round-button"><img
              src="../components/icons/delete-icon.png" width="20px" height="20px"
              title="Delete Participant"></button>
        </td>
      </tr>
      </tbody>
    </table>

    <div class="overlay" :class="updateFormVisible ? 'visible' : ''"></div>
    <div class="form-container" :class="updateFormVisible ? 'visible' : ''">
      <form>
        <div class="form-control">
          <label for="updateFirstname">First Name</label>
          <input type="text" name="updateFirstname" id="updateFirstname" v-model="updateParticipantResource.firstname">
        </div>
        <div class="form-control">
          <label for="updateLastname">Last Name</label>
          <input type="text" name="updateLastname" id="updateLastname" v-model="updateParticipantResource.lastname">
        </div>
        <div class="form-control">
          <label for="updateEmail">Email</label>
          <input type="email" name="updateEmail" id="updateEmail" v-model="updateParticipantResource.email">
        </div>
        <div class="form-control">
          <label for="updatePhoneNumber">Phone Number</label>
          <input type="text" name="updatePhoneNumber" id="updatePhoneNumber" v-model="updateParticipantResource.phoneNumber">
        </div>
        <div class="form-control button-field">
          <button @click.prevent="updateParticipant()">Save</button>
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
    transform: translateY(-75rem);
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
      transform: translateY(-5rem);
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
        padding: 2px;
        display: grid;
        grid-template-columns: 1fr 1fr;
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