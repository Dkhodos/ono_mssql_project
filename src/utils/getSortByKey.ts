interface BaseObject {
    id: string
}

export default function getSortByKey<T extends object>(key: keyof T){
    return (obj1: T, obj2: T) => {
        if(obj1[key] > obj2[key]) return 1;
        if(obj1[key] < obj2[key]) return -1;
        return 0;
    }
}
