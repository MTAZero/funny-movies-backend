import { start } from 'repl';

export const FixMonth = (month: any = 1) => {
    month = parseInt(month)
    if (month < 1) month = 1;
    if (month > 12) month = 12;
    return month;
};

export const FixYear = (year: any = 2020) => {
    year = parseInt(year)
    if (year < 2020) year = 2020;
    if (year > 2050) year = 2050;
    return year;
};

export function GetMonthArr(
    startMonth = 1,
    startYear = 2010,
    endMonth = 12,
    endYear = 2021,
): Array<any> {
    let ans = [];

    startMonth = FixMonth(startMonth);
    endMonth = FixMonth(endMonth);
    startYear = FixYear(startYear);
    endYear = FixYear(endYear);

    for (let index = startYear; index <= endYear; index++) {
        let _fromMonth = index == startYear ? startMonth : 1;
        let _toMonth = index == endYear ? endMonth : 12;

        for (let im = _fromMonth; im <= _toMonth; im++) {
            let _item = {
                month: im,
                year: index,
            };
            ans.push(_item);
        }
    }

    return ans;
}
