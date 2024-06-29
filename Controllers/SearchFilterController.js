const { CatchAsyncError, ErrorHandler } = require("nodejs-corekit");

const GetProducts = CatchAsyncError(async (req, res, next) => {

  let match = {};
  let sort = {};
  let aggregateQuery = [];

  // price filter
  let plt = req.query.plt || 1000000;
  let pgt = req.query.pgt || 0;

  if (plt || pgt) {
    match.p_final_price = {
      $gte: parseInt(pgt),
      $lte: parseInt(plt),
    };
  }

  // item_type filter
  let pitem_type = req.query.item_type;
  if (pitem_type) {
    match.item_type = {
      $eq: pitem_type,
    };
  }

  // by location
  let plocation = req.query.location;
  if (plocation) {
    match.location = {
      $eq: plocatoin,
    };
  }

  let pstatus = req.query.availability_status;
  if (pstatus) {
    match.p_status = {
      $eq: pstatus,
    };
  }

  // by_keyword
  let keywords = req.query.keywords;
  if (keywords) {
    match.pname = {
      $in: keywords.split(","),
    };
  }

  // product categories
  let pcategory = req.query.pcategory;
  if (pcategory) {
    match.p_category = {
      $in: pcategory.split(","),
    };
  }

  // search
  let q = req.query.q;

  // sortBy
  let sortBy = req.query.sortBy || "";
  if (sortBy) {
    let sortItems = sortBy.split(",");
    sortItems.forEach((s) => {
      if (s !== "") {
        const parts = s.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
      }
    });
    aggregateQuery.push({ $sort: sort });
  }

  aggregateQuery.push(
    match
      ? {
          $match: {
            $and: [match],
          },
        }
      : {
          $match: {},
        }
  );

  let lengthProduct = await Product.aggregate(aggregateQuery);
  let totalProducts = lengthProduct.length;
  // limit & skip for the pagination
  let limit = req.query.limit;
  let skip = req.query.skip || 0;

  if (skip) {
    aggregateQuery.push({ $skip: Number(skip) });
  }
  if (limit) {
    aggregateQuery.push({ $limit: Number(limit) });
  }

  console.log(match);
  let aggregate = await Product.aggregate(aggregateQuery);

  let products = await Product.populate(aggregate, { path: "p_offer" });

  if (q) {
    let arr = [];
    products.map((p) => {
      Object.keys(p).find((k) => {
        if (!Array.isArray(p[k])) {
          if (
            p[k]?.toString().toLowerCase().includes(q.toLowerCase().trim()) ===
            true
          ) {
            arr.push(p);
            return true;
          }
        }
      });
    });
    products = arr;
    totalProducts = arr.length;
  }

  if (!products) {
    return next(new ErrorHandler("no products found!", 404));
  }

  res
    .status(200)
    .json({
      success: true,
      totalProducts,
      pageProducts: products.length,
      products,
    });
});

module.exports = GetProducts;
