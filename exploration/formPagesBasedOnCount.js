function formPagesBasedOnCount(input) {
    let count = input.result[0].count;
    let batchSize = input.batchSize || 100;
    let totalPages = Math.ceil(count / batchSize);
    return Array.from({ length: totalPages }, (_, i) => ({
        page: i + 1,
        offset: i * batchSize,
        limit: batchSize
    }));
}

module.exports = formPagesBasedOnCount;