const Products = require('../models/Products');

const { CatchAsyncError} = require("nodejs-corekit")

const rentProduct = CatchAsyncError(async (req, res) => {
    const user = req.user;
      const product = await Products.findOne({ product_name });
      if (!student)
        return res.status(404).json({ message: 'Course not found' });
      student.course_name = course_name;
      await student.save();
      res.status(201).json({ message: 'Student registered for the course successfully' });
  });

module.exports = {
  rentProduct,
}