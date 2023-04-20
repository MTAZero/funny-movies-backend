export interface IDbFactory<T> {
    
    getItemsByFilter(filter: object, skip: number, limit: number, sort: any): Promise<any>;
    
    getItemById(id: any): Promise<any>;

    update(id: any, entity: any): Promise<any>;

    remove(id: any): Promise<boolean>;

    insert(entity: any): Promise<any>;
}
