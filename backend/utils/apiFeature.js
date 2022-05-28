class apiFeature {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // ---------------------------------SEARCH FILTER FOR SHOWING SOME PARTICULAR PRODUCT--------------------------    
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };

        // -----------------------------------------CATEGORY FETCH BY FILTER METHOD-----------------------------------
        const removedCategory = ['keyword', 'page', 'limit'];

        removedCategory.forEach(key => delete queryCopy[key]);

        // ---------------------------------------------PRICE FILTER--------------------------------------------------
        let queryStr = JSON.stringify(queryCopy);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(numofpage) {

        // ----------------------------------------PAGINATION FOR PAGE---------------------------------------------
        let currPage = Number(this.queryStr.page) || 1;

        const skip = numofpage * (currPage - 1);

        this.query = this.query.limit(numofpage).skip(skip);
        return this;
    }
}

module.exports = apiFeature;