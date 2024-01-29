import { faker } from "@faker-js/faker";
import {GeneratorFormatter} from "./GeneratorFormatter.js";

const formatter = new GeneratorFormatter()

export class Interaction {
    constructor({user_id, content_id, type, content, source, time_spent, date} = {}) {
        this.user_id = user_id; // This should be provided, as it references a User
        this.content_id = content_id; // This should be provided, as it references Content
        this.type = type ?? faker.lorem.word();
        this.content = content ?? faker.lorem.sentence();
        this.source = source ?? faker.internet.url();
        this.time_spent = time_spent ?? faker.datatype.number();
        this.date = date ?? faker.date.recent();
    }
}

export class InteractionGenerator {
    generateQuery(interactions) {
        const queryArray = [
            'INSERT INTO Interactions (user_id, content_id, type, content, source, time_spent, date)',
            'VALUES'
        ];

        for (let i = 0; i < interactions.length; i++) {
            queryArray.push(`(
                '${interactions[i].user_id}',
                '${interactions[i].content_id}',
                '${interactions[i].type}',
                '${interactions[i].content}',
                '${interactions[i].source}',
                ${interactions[i].time_spent},
                '${formatter.formatDate(interactions[i].date)}')${i === interactions.length - 1 ? ";" : ","}`);
        }

        return queryArray.join("\n");
    }
}
