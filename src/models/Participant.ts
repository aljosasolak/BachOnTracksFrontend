import {Project} from "./Project";

export interface Participant {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    project: Project;
}