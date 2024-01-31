import { faker } from "@faker-js/faker";
import {GeneratorFormatter} from "./utils/GeneratorFormatter.js";
import {SqlBaseGenerator, SqlObject} from "./abc/BaseGenerator.js";

const formatter = new GeneratorFormatter()

interface ContentProps {
    id?: string;
    user_id: string;
    type?: string;
    text?: string;
    external_link?: string;
    date?: Date;
}

export class Content implements SqlObject{
    id: string;
    user_id: string;
    type: string;
    text: string;
    external_link: string;
    date: Date;
    constructor({id, user_id, type, text, external_link, date}: ContentProps) {
        this.id = id ?? faker.string.uuid();
        this.user_id = user_id; // This should be provided, as it references a User
        this.type = type ?? faker.lorem.word();
        this.text = text ?? faker.lorem.sentence();
        this.external_link = external_link ?? faker.internet.url();
        this.date = date ?? faker.date.recent();
    }
}

export class ContentGenerator implements SqlBaseGenerator<Content>{
    generateQuery(contents: Content[]) {
        const queryArray = [
            'INSERT INTO Content (id, user_id, type, text, external_link, date)',
            'VALUES'
        ];

        for (let i = 0; i < contents.length; i++) {
            queryArray.push(`(
                '${contents[i].id}',
                '${contents[i].user_id}',
                '${contents[i].type}',
                '${contents[i].text}',
                '${contents[i].external_link}',
                '${formatter.formatDate(contents[i].date)}')${i === contents.length - 1 ? ";" : ","}`);
        }

        return queryArray.join("\n");
    }
}
