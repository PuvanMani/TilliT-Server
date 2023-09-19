function APIFeatures() {

}


APIFeatures.prototype.Search = function (query, queryStr) {
    let keyword = queryStr.keyword ? {
        ProductName: {
            $regex: queryStr.keyword,
            $options: "i"
        }
    } : {}

    return query.find({ ...keyword })
}


APIFeatures.prototype.Filter = function (query, queryStr) {

    const removeFields = ["keyword", 'limit', 'page', 'action'];
    removeFields.forEach(field => delete queryStr[field])

    let queryStrCopy = JSON.stringify(queryStr)
    queryStrCopy = queryStrCopy.replace(/\b(gt|gte|lt|lte)/g, (match) => `$${match}`)

    return query.find(JSON.parse(queryStrCopy))
}

APIFeatures.prototype.Pagenate = function (query, queryStr) {
    const perPage = 2;
    const currentPage = Number(queryStr.page) || 1;
    const skip = perPage * currentPage - 1;

    return query.limit(perPage).skip(skip)
}


module.exports = APIFeatures;