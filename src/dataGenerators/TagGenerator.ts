import { faker } from "@faker-js/faker";
import {SqlBaseGenerator} from "./abc/BaseGenerator.js";

interface Props {
    id?: string
    name?: string
}

export class Tag {
    id: string
    name: string

    constructor({id, name}: Props) {
        this.id = id ?? faker.string.uuid();
        this.name = name ?? faker.lorem.word();
    }
}

export class TagGenerator implements SqlBaseGenerator<Tag>{
    generateQuery(tags: Tag[]) {
        const queryArray = [
            'INSERT INTO Tags (id, name)',
            'VALUES'
        ];

        for (let i = 0; i < tags.length; i++) {
            queryArray.push(`(
                '${tags[i].id}',
                '${tags[i].name}')${i === tags.length - 1 ? ";" : ","}`);
        }

        return queryArray.join("\n");
    }
}
