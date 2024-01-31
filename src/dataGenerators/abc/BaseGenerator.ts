export interface SqlObject {

}

export interface SqlBaseGenerator<T extends SqlObject> {
    generateQuery: (objects : T[]) => string
}
