import {User} from "./User";


export interface Project {
    id: string;
    title: string;
    description: string;
    startingDate: Date;
    endingDate: Date;
    user: User;
}
