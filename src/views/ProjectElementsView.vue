<script lang="ts">


// Project ID aus URL bekommen
import TheAppointments from "@/components/TheAppointments.vue";
import TheParticipants from "@/components/TheParticipants.vue";
import TheFile from "@/components/TheFile.vue";
import {Project} from "@/models/Project";


export default {
  components: {TheParticipants, TheAppointments, TheFile},
  data() {
    return {
      apiBaseUrl: 'http://localhost:8080/api/',
      project: {} as Project
    }
  },
  mounted() {
    this.fetchProject()
  },
  methods: {
    fetchProject() {
      fetch(`${this.apiBaseUrl}projects/${this.projectId}`)
          .then(response => response.json())
          .then((data: Project) => this.project = data)
    }
  },
  props: ['projectId', 'projectTitle']
}


</script>

<template>
  <main>
    <h2 class="project-title"> {{ project.title }}</h2>
    <TheAppointments :project-id="projectId"/>
    <TheParticipants :project-id="projectId"/>
    <TheFile :project-id="projectId"/>
  </main>
</template>

<style scoped lang="scss">
.project-title {
  padding: .7rem 1rem;
  text-align: center;
  font-family: "Times New Roman", sans-serif;
  font-size: 3rem;
  font-style: italic;
  border-radius: 55px;
  background-color: white;
}
</style>
