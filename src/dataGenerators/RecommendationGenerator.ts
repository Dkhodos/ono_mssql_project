import {SqlBaseGenerator, SqlObject} from "./abc/BaseGenerator.js";
import {faker} from "@faker-js/faker";

interface RecommendationProps {
    id?: string;
    content_id: string;
    segment_id: string;
}

export class Recommendation implements SqlObject {
    id: string;
    content_id: string;
    segment_id: string;

    constructor({ id, content_id, segment_id }: RecommendationProps) {
        this.id = id ?? faker.string.uuid();
        this.content_id = content_id;
        this.segment_id = segment_id;
    }
}

export class RecommendationGenerator implements SqlBaseGenerator<Recommendation> {
    generateQuery(recommendations: Recommendation[]) {
        const queryArray = [
            'INSERT INTO Recommendations (id, content_id, segment_id)',
            'VALUES'
        ];

        for (let i = 0; i < recommendations.length; i++) {
            queryArray.push(`(
            '${recommendations[i].id}', 
            '${recommendations[i].content_id}', 
            '${recommendations[i].segment_id}')${i === recommendations.length - 1 ? ";" : ","}`);
        }

        return queryArray.join("\n");
    }
}
