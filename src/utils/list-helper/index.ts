import { isFunction } from '../common';

const AddItemToList = (list: Array<any>, item: any) => {
    list.push(item);
    return list;
};

const RemoveItemFromList = (list: Array<any>, item: any) => {
    return list.filter((entity) => entity !== item);
};

const FindFirstItemByFilter = (list: Array<any>, filter: any) => {
    let ans = list[0] ? list[0] : null;
    if (isFunction(filter)) {
        list = list.filter((entity) => filter(entity));
        ans = list[0] ? list[0] : null;
    }

    return ans;
};

export const ListHelper = {
    AddItemToList,
    RemoveItemFromList,
    FindFirstItemByFilter
};
