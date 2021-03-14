const db = require("../configs/mySQL");
const qs = require("../helpers/Query");
const concat = require("../helpers/Concat");
const fs = require("fs");
const attrModel = require("../models/AttributeModel");

module.exports = {
    getAllProduct: (query) => {
        return new Promise((resolve, reject) => {
          const {
            search,
            category,
            brand,
            size,
            color,
            order,
            sort,
            user_id,
          } = query;
          const limit = Number(query.limit) || 15;
          const page = Number(query.page) || 1;
          const offset = (page - 1) * limit || 0;
          let selectedTable = "";
          let where = "WHERE ";
          let joins = "";
          const ordering = order || "newest";
          let sorting = (sort && sort.toUpperCase()) || "DESC";
    
          if (search) {
            if (category) {
              where += `p.product_title LIKE '%${search}%' AND `;
            } else {
              where += `(p.product_title LIKE '%${search}%' OR c.category_name LIKE '%${search}%') AND `;
            }
          }
    
          if (category) {
            where += concat.concatManyWhere(category, "c.category_link");
          }
          if (brand) {
            where += concat.concatOneWhere(brand, "b.brand_name");
          }
          if (user_id) {
            where += concat.concatOneWhere(user_id, "p.user_id");
          }
          if (size) {
            joins += ` JOIN product_sizes AS ps ON ps.product_id = p.product_id JOIN sizes AS s ON s.size_id = ps.size_id `;
            where += concat.concatManyWhere(size, "s.size_value");
          }
          if (color) {
            joins += ` JOIN product_colors AS pc ON pc.product_id = p.product_id JOIN colors AS cl ON cl.color_id = pc.color_id `;
            where += concat.concatOneWhere(color, "cl.color_name");
          }
    
          if (where !== "") {
            let p = where.split("AND");
            p.splice(p.length - 1, 1);
            where = p.join("AND ");
          }
    
          if (ordering == "name") {
            selectedTable = "p.product_title";
          } else if (ordering == "newest") {
            selectedTable = "p.created_at";
          } else if (ordering == "price") {
            selectedTable = "p.product_price";
          } else if (ordering == "popular") {
            selectedTable = "product_rating";
          } else {
            selectedTable = "p.created_at";
          }
    
          if (sorting !== "DESC" && sorting !== "ASC") {
            sorting = "ASC";
          }
    
          db.query(
            qs.queryCount(joins, where, `ORDER BY ${selectedTable} ${sorting}`),
            (err, total) => {
              if (err) {
                reject(err);
              }
              db.query(
                qs.queryProduct(
                  joins,
                  where,
                  `ORDER BY ${selectedTable} ${sorting} LIMIT ${limit} OFFSET ${offset}`
                ),
                (err, data) => {
                  if (!err) {
                    resolve({
                      totalProducts: total.length,
                      products: data,
                    });
                  } else {
                    reject(err);
                  }
                }
              );
            }
          );
        });
      },
      getProductAttributebyQuery : (qs) => {
          return new Promise((resolve, reject) => {
              db.query(qs, (err,data) => {
                  if(!err){
                      resolve(data);
                  } else {
                      reject(err);
                  }
              })
          })
      },
      insertProduct: (data) => {
          return new Promise((resolve, reject) => {
              const queryS = `INSERT INTO products SET ?`
              db.query(queryS, (err,data) => {
                  if (!err){
                      resolve(data);
                  } else {
                      reject(err);
                  }
              })
          })
      },
      updateProduct: (id, body, isFile) => {
        return new Promise((resolve, reject) => {
          const queryS = `UPDATE products SET ? WHERE product_id=${id}`;
          db.query(queryS, body, (err, data) => {
            if (isFile !== false) {
              db.query(
                `SELECT * FROM product_images WHERE product_id=${id}`,
                (err, imagesData) => {
                  if (err) {
                    return reject(err);
                  } else {
                    resolve(imagesData);
                    db.query(
                      `DELETE FROM product_images WHERE product_id=${id}`,
                      (err, _) => {
                        if (err) {
                          return reject(err);
                        } else {
                          if (imagesData.length) {
                            imagesData.map((image) => {
                              fs.unlink("./public" + image.image_path, (err) => {
                                return reject(err);
                              });
                            });
                            const imagesArr = isFile.map((i) => {
                              const filepath = "/images/products/" + i.filename;
                              return [id, filepath];
                            });
                            attrModel
                              .insertUploadImages(imagesArr)
                              .then(() => {
                                return resolve(data);
                              })
                              .catch((err) => {
                                return reject(err);
                              });
                          }
                          return resolve(data);
                        }
                      }
                    );
                  }
                }
              );
            } else {
              if (!err) {
                resolve(data);
              } else {
                reject(err);
              }
            }
          });
        });
      },
      deleteProduct: (id) => {
        return new Promise((resolve, reject) => {
          db.query(
            `SELECT * FROM product_images WHERE product_id=${id}`,
            (err, imagesData) => {
              if (err) {
                return reject(err);
              } else {
                const queryS = `DELETE FROM products WHERE product_id=${id}`;
                db.query(queryS, (err, data) => {
                  if (err) {
                    return reject(err);
                  } else {
                    if (imagesData.length) {
                      imagesData.map((image) => {
                        fs.unlink("./public" + image.image_path, (err) => {
                          return reject(err);
                        });
                      });
                    }
                    return resolve(data);
                  }
                });
              }
            }
          );
        });
      },
      insertAttrProduct: (body, table) => {
        return new Promise((resolve, reject) => {
          const queryS = `INSERT INTO ${table} SET ?`;
          db.query(queryS, body, (err, data) => {
            if (!err) {
              resolve(data);
            } else {
              reject(err);
            }
          });
        });
      },
      updateProperty: async (data) => {
        try {
          for (let i = 0; i < data.length; i++) {
            const productImage = await attrModel.getProductAttributeByQuery(
              qs.getQueryWhere(
                "product_images",
                "product_image_id, image_path",
                "product_id",
                data[i].product_id
              )
            );
    
            data[i].product_images = productImage;
          }
          return data;
        } catch (e) {
          return e;
        }
      },
      getImageByProductId: (productId) => {
        return new Promise((resolve, reject) => {
          const queryS = `SELECT * FROM product_images WHERE product_id=${productId}`;
          db.query(queryS, (err, data) => {
            if (!err) {
              resolve(data);
            } else {
              reject(err);
            }
          });
        });
      },
      deleteProductImageById: (imageId, productId) => {
        return new Promise((resolve, reject) => {
          // const queryS = `DELETE FROM product_images WHERE product_image_id=${imageId}`
          db.query(
            qs.queryDelete(
              "product_images",
              `product_image_id=${imageId} AND product_id=${productId}`
            ),
            (err, data) => {
              if (!err) {
                resolve(data);
              } else {
                reject(err);
              }
            }
          );
        });
      },
      insertBatch: (colors, product_id, table) => {
        return new Promise((resolve, reject) => {
          for (let i = 0; i < colors.length; i++) {
            const queryS = `INSERT INTO ${table} VALUES ('', ${product_id}, ${colors[i]})`;
            db.query(queryS, (err, _) => {
              if (err) {
                reject(err);
              }
            });
          }
          resolve("Inserted");
        });
      },
}