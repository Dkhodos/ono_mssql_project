import {faker} from "@faker-js/faker";
import {GeneratorFormatter} from "./utils/GeneratorFormatter.js";
import {SqlBaseGenerator, SqlObject} from "./abc/BaseGenerator.js";

const formatter = new GeneratorFormatter()

interface Props {
    id?: string
    email?: string
    demographic?: string
    date_of_birth?: Date
    friend_count?: number
}

export class User implements SqlObject{
    id: string
    email: string
    demographic: string
    date_of_birth: Date
    friend_count: number

    constructor({id, email, demographic, date_of_birth, friend_count}: Props) {
        this.id = id ?? faker.string.uuid();
        this.email = email ?? faker.internet.email();
        this.demographic = demographic ?? faker.location.county();
        this.date_of_birth = date_of_birth ?? faker.date.past();
        this.friend_count = friend_count ?? faker.number.int({min: 1, max: 10000});
    }
}

export class UserGenerator implements SqlBaseGenerator<User>{
    generateQuery(users: User[]){
        const queryArray = [
            'INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)',
            'VALUES'
        ]

        for (let i = 0; i < users.length; i++) {
            queryArray.push(`(
            '${users[i].id}', 
            '${users[i].email}', 
            '${users[i].demographic}', 
            '${formatter.formatDate(users[i].date_of_birth)}', 
            ${users[i].friend_count})${i === users.length -  1 ? ";" : ","}`);
        }

        return queryArray.join("\n");
    }
}
