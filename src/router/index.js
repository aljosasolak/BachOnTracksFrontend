import {createRouter, createWebHistory} from 'vue-router'
import ProjectView from '../views/ProjectListView.vue'
import AppointmentFileParticipant from "@/views/ProjectElementsView.vue";
import ProjectElementsView from "@/views/ProjectElementsView.vue";
import ReviewButton from "@/components/ReviewButton.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'reviewButton',
            component: ReviewButton
        },
        {
            path: '/api/projects',
            name: 'project',
            component: ProjectView
        },
        {
            path: '/api/projects/:projectId',
            name: 'projectElements',
            component: ProjectElementsView,
            props: true
        }
    ]
})

export default router
