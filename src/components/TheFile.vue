<script lang="ts">

import {CreateFileResource} from "@/models/CreateFileResource";
import {File} from "@/models/File";

export default {

  props: ['projectId'],

  data() {
    return {
      apiBaseUrl: 'http://localhost:8080/api/',
      files: [] as Array<File>,
      // createFileResource: {} as CreateFileResource,
      isVisible: false
    }
  },
  mounted() {
    this.fetchFiles()
  },
  methods: {
    fetchFiles() {
      fetch(`${this.apiBaseUrl}files/${this.projectId}`)
          .then(response => response.json())
          .then((data: Array<File>) => this.files = data)
    },
    createFile() {
      const fileInput = document.getElementById('fileName') as HTMLInputElement;
      const file = fileInput.files[0];

      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('projectId', this.projectId);

      fetch(`${this.apiBaseUrl}files/${this.projectId}`, {
        method: 'POST',
        body: formData,
      }).then((response) => console.log(response))
          .then();
    },
    downloadFile(fileId) {
      try {

        let contentType;
        let filename;

        fetch(`${this.apiBaseUrl}files/${fileId}/download`, {})
            .then(response => {
              contentType = response.headers['content-type'];
              const disposition = response.headers.get('Content-Disposition');
              const parts = disposition.split(';');
              let quotedName = parts[1].split('=')[1];
              filename = quotedName.substring(1, quotedName.length - 1);
              return response.blob();
            })
            .then(blob => {

                  // Create a new Blob object using the response data
                  const file = new Blob([blob], {type: contentType});

                  // Create a link element
                  const link = document.createElement('a');

                  // Set the href attribute to the Blob URL
                  link.href = window.URL.createObjectURL(blob);

                  // Set the download attribute to the filename
                  link.download = filename;

                  // Append the link to the body
                  document.body.appendChild(link);

                  // Programmatically click the link to trigger the download
                  link.click();

                  // Remove the link from the document
                  document.body.removeChild(link);
                }
            )
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    },
    deleteFile(fileId) {

      const confirmed = confirm("Are you sure to permanently delete the file?");

      if(!confirmed) {
        return;
      }


      fetch(`${this.apiBaseUrl}files/${fileId}`, {
        method: 'DELETE'
      })
          .then(response => {
            if (response.ok) {
              this.files = this.files.filter(file => file.id !== fileId);
            }
          })
    },
    toggleModal() {
      this.isVisible = !this.isVisible;
    }
  }
}


</script>

<template>
  <div class="container">
    <div class="button-wrapper">
      <button @click="toggleModal()">Upload File</button>
    </div>

    <div class="overlay" :class="isVisible ? 'visible' : ''"></div>
    <div class="form-container" :class="isVisible ? 'visible' : ''">
      <form enctype="multipart/form-data">
        <!--    <div class="form-control">
            <label for="fileName">File Name</label>
              <input type="text" name="fileName" id="fileName">
            </div>-->
        <div class="form-control">
          <input type="file" name="fileName" id="fileName">
        </div>
        <div class="form-control button-field">
          <button @click.prevent="createFile()" class="">Save</button>
          <button>Cancel</button>
        </div>
      </form>
    </div>


    <table v-if="files.length > 0" class="table table-hover">
      <thead>
      <tr>
        <th scope="col">File Name</th>
        <th scope="col"></th>
        <th scope="col"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="file in files" v-bind:key="file.id">
        <td> {{ file.fileName }}</td>
        <td>
          <button @click="downloadFile(file.id)" class="round-button"><img
              src="../components/icons/download-icon.png" width="20px" height="20px"
              title="Download File"></button>
        </td>
        <td>
          <button @click="deleteFile(file.id)" class="round-button"><img
              src="../components/icons/delete-icon.png" width="20px" height="20px"
              title="Delete File"></button>
        </td>
      </tr>
      </tbody>
    </table>
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
    height: 300vh;
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

  input[type="file"]::file-selector-button {
    width: 105px;
    padding: 5px;
    background-color: $backgroundBlue;
    border: none;
    border-radius: 25px;
    color: #ffffff;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>