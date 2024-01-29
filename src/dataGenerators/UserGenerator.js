import {faker} from "@faker-js/faker";
import {GeneratorFormatter} from "./GeneratorFormatter.js";

const formatter = new GeneratorFormatter()

export class User{
    constructor({id, email, demographic, date_of_birth, friend_count} = {}) {
        this.id = id ?? faker.string.uuid();
        this.email = email ?? faker.internet.email();
        this.demographic = demographic ?? faker.location.county();
        this.date_of_birth = date_of_birth ?? faker.date.past();
        this.friend_count = friend_count ?? faker.number.int({min: 1, max: 10000});
    }
}

export class UserGenerator {
    generateQuery(users){
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
