import { faker } from "@faker-js/faker";
import {GeneratorFormatter} from "./utils/GeneratorFormatter.js";
import {SqlBaseGenerator, SqlObject} from "./abc/BaseGenerator.js";

const formatter = new GeneratorFormatter()

interface Props{
    user_id: string
    content_id: string
    type?: string
    content?: string
    source?: string
    time_spent?: number
    date?: Date
}

export class Interaction implements SqlObject{
    user_id: string
    content_id: string
    type: string
    content: string
    source: string
    time_spent: number
    date: Date

    constructor({user_id, content_id, type, content, source, time_spent, date}: Props) {
        this.user_id = user_id; // This should be provided, as it references a User
        this.content_id = content_id; // This should be provided, as it references Content
        this.type = type ?? faker.lorem.word();
        this.content = content ?? faker.lorem.sentence();
        this.source = source ?? faker.internet.url();
        this.time_spent = time_spent ?? faker.datatype.number();
        this.date = date ?? faker.date.recent();
    }
}

export class InteractionGenerator implements SqlBaseGenerator<Interaction>{
    generateQuery(interactions: Interaction[]) {
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
