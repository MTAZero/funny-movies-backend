const default_version = process.env.VERSION ? process.env.VERSION : '1.0'

export const ResponseToClient = (res, status, code, message, data, version = default_version) => {
    let ans = {
        input_correct: status,
        code:  code,
        message: message,
        data: data,
        version: "Api version " + version
    }

    return res.status(code).send(ans);
}