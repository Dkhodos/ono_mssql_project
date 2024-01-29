
export class ContentTag {
    constructor({content_id, tag_id} = {}) {
        this.content_id = content_id; // This should be provided, as it references Content
        this.tag_id = tag_id; // This should be provided, as it references Tag
    }
}

export class ContentTagGenerator {
    generateQuery(contentTags) {
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
