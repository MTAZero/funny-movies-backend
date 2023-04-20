import * as fs from 'fs';

export const removeFile = async (path = "") => {
    await fs.unlinkSync(path);
}