import {SqlObject, SqlBaseGenerator} from "./abc/BaseGenerator.js";

interface ContentTagProps {
    content_id: string
    tag_id: string
}

export class ContentTag implements SqlObject{
    public content_id: string;
    public tag_id: string;
    constructor({content_id, tag_id}: ContentTagProps) {
        this.content_id = content_id; // This should be provided, as it references Content
        this.tag_id = tag_id; // This should be provided, as it references Tag
    }
}

export class ContentTagGenerator implements SqlBaseGenerator<ContentTag>{
    generateQuery(contentTags: ContentTag[]) {
        const queryArray = [
            'INSERT INTO Content_Tags (content_id, tag_id)',
            'VALUES'
        ];

        for (let i = 0; i < contentTags.length; i++) {
            queryArray.push(`(
                '${contentTags[i].content_id}',
                '${contentTags[i].tag_id}')${i === contentTags.length - 1 ? ";" : ","}`);
        }

        return queryArray.join("\n");
    }
}
