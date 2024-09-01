import {Project} from "./Project";

export interface Appointment {
id: string;
date: Date;
startingTime: Date;
endingTime: Date;
status: string;
location: string;
type: string;
project: Project;
}