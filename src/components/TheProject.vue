<script lang="ts">

import {Project} from "@/models/Project";
import {CreateProjectResource} from "@/models/CreateProjectResource";
import moment from "moment";


export default {
  data() {
    return {
      apiBaseUrl: 'http://localhost:8080/api',
      projects: [] as Array<Project>,
      createProjectResource: {} as CreateProjectResource,
      isVisible: false
    }
  },
  mounted() {
    this.fetchProjects()
  },
  methods: {
    createProject() {
      fetch(`${this.apiBaseUrl}/projects/`, {
        method: 'POST',
        body: JSON.stringify(this.createProjectResource),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            this.fetchProjects()
            // this.toggleModal()
            this.createProjectResource = {} as CreateProjectResource
          })
    },
    fetchProjects() {
      fetch(`${this.apiBaseUrl}/projects/`)
          .then(response => response.json())
          .then((data: Array<Project>) => this.projects = data)
    },
    save() {
      this.showCreateForm = !this.showCreateForm;
      this.createProject()
    },
    cancel() {
      this.showCreateForm = !this.showCreateForm;
    },
    deleteProject(id: string) {
      fetch(`${this.apiBaseUrl}/projects/${id}`, {
        method: 'DELETE'
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to delete project');
            }
            return response.json();
          })
          .then(() => {
            console.log('Project deleted successfully')
          })
          .catch(error => {
            console.error('Error deleting project:', error);
          })
          .then(() => this.fetchProjects());
    },
    showCreateForm() {
      this.showCreateForm = !this.showCreateForm;
    },
    formatDate(date: string, formatPattern = 'DD. MM. YYYY') {
      return moment(date).format(formatPattern)
    },
    toggleModal() {
      this.isVisible = !this.isVisible;
    }
  }
}
</script>

<template>
  <div class="overlay" :class="isVisible ? 'visible' : ''"></div>
  <div class="form-container" :class="isVisible ? 'visible' : ''">
    <div class="active-form">
      <form>
        <div class="form-control">
          <label for="title">Project Name</label>
          <input type="text" name="title" id="title" v-model="createProjectResource.title"/>
        </div>
        <div class="form-control">
          <label for="description">Description</label>
          <input type="text" name="description" id="description" v-model="createProjectResource.description">
        </div>
        <div class="form-control">
          <label for="startingDate">Starting Date</label>
          <input type="date" name="startingDate" id="startingDate" v-model="createProjectResource.startingDate">
        </div>
        <div class="form-control">
          <label for="endingDate">Ending date</label>
          <input type="date" name="endingDate" id="endingDate" v-model="createProjectResource.endingDate">
        </div>
        <div class="form-control button-field">
          <div class="button-div">
            <button @click.prevent="save()">Save</button>
          </div>
          <div class="button-div">
            <button @click="cancel()">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <div class="main-wrapper">
    <div class="button-wrapper">
      <button @click="toggleModal()">Put Bach back on Tracks - New Project</button>
    </div>

    <div v-if="projects.length > 0" class="project-container">
      <div v-for="project in projects" v-bind:key="project.id" class="project-wrapper">
        <div class="fixed-height">
          <h2> {{ project.title }}</h2>
          <div v-show="project.description.length > 0" class="project-description"> {{ project.description }}</div>
          <div class="project-duration"> {{ formatDate(project.startingDate) }} - {{ formatDate(project.endingDate) }}
          </div>
        </div>
        <div class="button-field">
          <router-link
              :to="{ name: 'projectElements', params: { projectId: project.id }, query: { projectTitle: project.title} }">
            <button>Edit</button>
          </router-link>
          <button @click="deleteProject(project.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$gradientBlue: linear-gradient(45deg, #1b047a, #3168eb, #94f0f5, rgba(158, 231, 244, 0));
$gradientDarkBlue: linear-gradient(45deg, #1b047a, #3168eb);
$darkBlue: rgb(17, 9, 92);
$backgroundBlue: #3168eb;
$warmWhite: #faf6ee;

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
  transform: translateY(-95rem);
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
    justify-content: space-around;

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

.main-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem;
  padding: 1rem .5rem;
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

  .project-frame {
    width: 100%;

    padding: 20px;
    background: $gradientBlue;
    border-radius: 50px;
    border: 1px solid purple;

  }

  .project-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
    width: 100%;
    background-color: $gradientBlue;
    border-radius: 25px;

    .project-wrapper {
      margin-bottom: 2rem;
      width: 100%;
      height: 500px;
      padding: 1rem;
      border-radius: 25px;
      box-shadow: 0 0 20px -4px #c6bdb4;

      .fixed-height {
        height: 420px;

        h2 {
          margin-bottom: 1rem;
          padding: 1rem;
          font-family: "Times New Roman", sans-serif;
          text-align: center;
          font-size: 40px;
          font-weight: bold;
          font-style: italic;
          box-shadow: 0 0 20px -4px #c6bdb4;
          border-radius: 25px;
        }

        .project-duration, .project-description {
          padding: 1rem;
          box-shadow: 0 0 20px -4px #c6bdb4;
          border-radius: 25px;
        }

        .project-description {
          margin-bottom: 1rem;
          padding: 1rem;
          font-family: "Times New Roman", sans-serif;
          text-align: center;
          font-size: 20px;

          border-radius: 25px;
        }

        .project-duration {
          margin-bottom: 1rem;
          padding: 1rem;
          font-family: "Times New Roman", sans-serif;
          text-align: center;
          font-size: 25px;
          font-weight: bold;

          border-radius: 25px;
        }

      }

      .button-field {
        display: flex;
        padding-left: 2.5rem;
        padding-right: 2.5rem;
        justify-content: space-around;

        button {
          width: 100px;
          padding: 8px 0;
          background: $backgroundBlue;
          border-radius: 25px;
          border: $warmWhite;
          font-size: 20px;
          color: $warmWhite;
          font-weight: bold;
          transition: all ease-in-out 0.3s;

          &:hover {
            color: #ffffff;
            background: rgb(20, 5, 140);
          }
        }
      }
    }
  }
}


@keyframes color {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

</style>