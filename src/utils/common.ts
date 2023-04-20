export const isFunction = (a: any) => {
    if (typeof a === 'function') return true;
    return false;
};

export const Sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const SleepSecond = async (s) => {
    await Sleep(s * 1000);
};

export const ToJson = (obj: any) => {
    return JSON.stringify(obj)
}

export const JsonToObject = (json: string) => {
    let ans = JSON.parse(json);
    return ans;
}

export const DeleteSpace = (str = '') => {
    let ans = ''
    for(let index = 0; index < str.length; index++)
        if (str[index] != ' ')
            ans = ans + str[index];
            
    return ans;
}
