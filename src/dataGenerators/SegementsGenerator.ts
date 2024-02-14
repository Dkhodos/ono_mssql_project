import { faker } from "@faker-js/faker";
import {SqlBaseGenerator, SqlObject} from "./abc/BaseGenerator.js";

interface SegmentProps {
    id?: string;
    name?: string;
}

export class Segment implements SqlObject {
    id: string;
    name: string;

    constructor({ id, name }: SegmentProps) {
        this.id = id ?? faker.string.uuid();
        this.name = name ?? faker.commerce.department();
    }
}

export class SegmentGenerator implements SqlBaseGenerator<Segment> {
    generateQuery(segments: Segment[]) {
        const queryArray = [
            'INSERT INTO Segments (id, name)',
            'VALUES'
        ];

        for (let i = 0; i < segments.length; i++) {
            queryArray.push(`(
            '${segments[i].id}', 
            '${segments[i].name}')${i === segments.length - 1 ? ";" : ","}`);
        }

        return queryArray.join("\n");
    }
}
