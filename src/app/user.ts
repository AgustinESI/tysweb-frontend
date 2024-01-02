import { UserMatchesInfo } from "./usermatchesinfo";

export class User {
    id: any;
    name!: string;
    email!: string;
    pwd1!: string;
    pwd2!: string;
    color!: string;
    image!: any;
    city !: string;
    temperature!: string;
    active!: boolean;
    lon!: string;
    lat!: string;
    paidMatches!: number;
    userMatchesInfo: UserMatchesInfo | null = null;
}
