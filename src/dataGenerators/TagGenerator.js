import { faker } from "@faker-js/faker";

export class Tag {
    constructor({id, name} = {}) {
        this.id = id ?? faker.string.uuid();
        this.name = name ?? faker.lorem.word();
    }
}

export class TagGenerator {
    generateQuery(tags) {
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
