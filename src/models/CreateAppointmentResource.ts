export interface CreateAppointmentResource {
    date: Date;
    startingTime: Date;
    endingTime: Date;
    status: string;
    location: string;
    type: string;
    projectId: string;
}