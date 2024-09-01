import {User} from "./User";


export interface CreateProjectResource {
    title: string;
    description: string;
    startingDate: Date;
    endingDate: Date;
    user: User;
}