class APIFeatures {
    constructor(query , queryString){
        this.query = query;
        this.queryString = queryString;
    };

    filter() {
        const queryObject = Object.fromEntries(Object.entries(this.queryString).filter(([key, value]) => value !== ""));

        const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];

        excludedFields.forEach(el => delete queryObject[el]);

        if (queryObject.category) {queryObject.category = {$in: queryObject.category.split(',')};}

        if (queryObject.subCategory) {queryObject.subCategory = {$in: queryObject.subCategory.split(',')};}

        let queryStr = JSON.stringify(queryObject);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this; 
    };

    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort("-createdAt");
        };

        return this;
    };

    search(){
        if(this.queryString.search){
            this.query = this.query.find({name:{$regex: this.queryString.search , $options: 'i'}});
        };
        
        return this;
    };

  paginate() {
    this.page = Number(this.queryString.page) || 1;

    this.limit = Number(this.queryString.limit) || 12;

    const skip = (this.page - 1) * this.limit;

    this.query = this.query.skip(skip).limit(this.limit);

    return this;
}
};

export default APIFeatures;