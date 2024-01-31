import { faker } from "@faker-js/faker";
import {SqlBaseGenerator, SqlObject} from "./abc/BaseGenerator.js";

interface Props {
    id?: string
    content_id: string
    media_type?: string
    url?: string
}

export class Media implements SqlObject{
    id: string
    content_id: string
    media_type: string
    url: string

    constructor({id, content_id, media_type, url}: Props) {
        this.id = id ?? faker.string.uuid();
        this.content_id = content_id; // This should be provided, as it references Content
        this.media_type = media_type ?? faker.lorem.word();
        this.url = url ?? faker.internet.url();
    }
}

export class MediaGenerator implements SqlBaseGenerator<Media>{
    generateQuery(mediaRecords: Media[]) {
        const queryArray = [
            'INSERT INTO Media (id, content_id, media_type, url)',
            'VALUES'
        ];

        for (let i = 0; i < mediaRecords.length; i++) {
            queryArray.push(`(
                '${mediaRecords[i].id}',
                '${mediaRecords[i].content_id}',
                '${mediaRecords[i].media_type}',
                '${mediaRecords[i].url}')${i === mediaRecords.length - 1 ? ";" : ","}`);
        }

        return queryArray.join("\n");
    }
}
