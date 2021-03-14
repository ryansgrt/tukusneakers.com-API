const db = require("../configs/mySQL");
const qs = require("../helpers/Query");

const productModel = require("./ProductModel");

const getProductAttribute = productModel.getProductAttributeByQuery;
const query = qs.getQueryWhere;

module.exports = {
  getAllProducts: (query) => {
    return new Promise((resolve, reject) => {
      const { key, order, sort, color, brand, size } = query;
      let where = "WHERE ";

      if (typeof key !== "undefined") {
        where += `p.product_title LIKE '%${key}%' OR c.category_name='${key}' AND`;
      }
      if (typeof color !== "undefined") {
        where += `pc.product_attr_value='${color}' AND`;
      }
      if (typeof brand !== "undefined") {
        where += `b.brand_name='${brand}' AND`;
      }
      if (typeof size !== "undefined") {
        where += `ps.product_attr_value='${brand}' AND`;
      }

      if (where !== "") {
        let p = where.split("AND");
        p.splice(p.length - 1, 1);
        where = p.join("AND ");
      }

      if (typeof order !== "undefined" && typeof sort !== "undefined") {
        let selectedTable = "",
          nSort;
        if (order.toLowerCase() == "name") {
          selectedTable += "product_title";
        } else if (order.toLowerCase() == "newest") {
          selectedTable += "created_at";
        } else if (order.toLowerCase() == "price") {
          selectedTable += "product_price";
        }
        nSort = sort.toUpperCase();
        where += `ORDER BY ${selectedTable} ${nSort} `;
      }

      const queryS = qs.queryProduct + where;
      db.query(queryS, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  },
  updatePropertyProduct: async (data) => {
    try {
      for (let i = 0; i < data.length; i++) {
        const productColor = await getProductAttribute(
          `SELECT c.color_id, c.color_name, c.color_code FROM product_colors AS pc JOIN colors AS c ON c.color_id = pc.color_id WHERE product_id = ${data[i].product_id}`
        );
        const productSize = await getProductAttribute(
          `SELECT s.size_id, s.size_value AS size_code FROM product_sizes AS ps JOIN sizes AS s ON s.size_id = ps.size_id WHERE ps.product_id = ${data[i].product_id}`
        );
        const productImage = await getProductAttribute(
          query(
            "product_images",
            "product_image_id, image_path",
            "product_id",
            data[i].product_id
          )
        );

        data[i].product_colors = productColor;
        data[i].product_sizes = productSize;
        data[i].product_images = productImage;
      }
      return data;
    } catch (e) {
      return e;
    }
  },
};
