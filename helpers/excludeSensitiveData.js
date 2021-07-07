const excludeSensitiveData = (data, excluded) => {
    const newData = {...data}
    excluded.forEach(key => {
        if (key in newData) {
            delete newData[key]
        }
    })
    return newData;
}

module.exports = excludeSensitiveData;
