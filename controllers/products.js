const Product= require('../models/product');


const getAllProductsStatic = async (req,res)=>{
    // throw new Error('testing async error package')

    const products=await Product.find({price:{$gt:40,$lt:100}}).select('price').limit(30)

    res.status(200).json({products,nHits:products.length});

}

const getAllProducts = async (req,res)=>{
    const {featured , company ,name,sort, fields ,numericFliters}=req.query;
    const queryObject={};
    if(featured){
        queryObject.featured=featured===true?true:false;
    }
    if(company){
        queryObject.company=company;    
    }
    if(name){
        queryObject.name={ $regex:name, $options: 'i'}
    }
    if(numericFliters){
        const operatorMap={
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const regEx = /\b(<|>|<=|=|>=)\b/g;
        let filters = numericFliters.replace(regEx,(match)=>`-${operatorMap[match]}-`);
        const options = ['price','rating'];
        filters=filters.split(',').forEach((item) => {
            const [filter, operator, value]=item.split('-');
            if(options.includes(filter)){
                queryObject[filter]={[operator]:Number(value)}
            }
        });

        console.log(queryObject);
    }
 


    console.log(queryObject);
    let result = Product.find(queryObject);
    //sorting
    if(sort){
        // result=result.sort();
        // console.log(sort);
        //incase of multiple sort criteria we get them seperated with , so we split on , and join with space( )
        const sortList = sort.split(',').join(' ');
        console.log(sortList);
        result = result.sort(sortList);
    }else{
        result= result.sort('createdAt')
    }
    //for field selection
    if(fields){
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList);
    }
    const page = Number(req.query.page)||1;
    const limit = Number(req.query.limit)||10;
    const skip = (page-1)*limit;
    result = result.skip(skip).limit(limit);


    const products=await result
    // const products= await Product.find(queryObject);
    res.status(200).json({products,nHits:products.length});
}

module.exports={
    getAllProducts,
    getAllProductsStatic
}