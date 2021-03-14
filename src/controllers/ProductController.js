const productModel = require("../models/product");
const productsModel = require("../models/products");
const attrModel = require("../models/attribute");
const form = require("../helpers/form");
const fs = require("fs");
const string = require("../helpers/concat");
// const { json } = require('express')

module.exports = {
  getAllProduct: (req, res) => {
    productModel
      .getAllProduct(req.query)
      .then((data) => {
        const { page, limit } = req.query;
        const url = req.originalUrl.split("?")[1] || "";
        const remove1 = string.removeString(url, `&page=${page}`);
        const remove2 = string.removeString(remove1, `page=${page}`);
        const remove3 = string.removeString(remove2, `&limit=${limit}`);
        const remove4 = string.removeString(remove3, `limit=${limit}`);
        const currentPage = Number(page) || 1;
        const limiter = limit || 15;

        const totalPage = Math.ceil(data.totalProducts / limiter);
        const paramsPage = remove4 == "" ? `page=` : `&page=`;
        const paramsLimit = paramsPage == "" ? `limit=` : `&limit=`;
        const nextPage = `/product?${remove4}${
          paramsPage + ((Number(page) || 1) + 1)
        }${limit ? paramsLimit + limit : ""}`;
        const prevPage = `/product?${remove4}${
          paramsPage + ((Number(page) || 1) - 1)
        }${limit ? paramsLimit + limit : ""}`;

        if (!data.products.length) {
          return res.json({
            message: "Page not Found",
          });
        }

        productModel
          .updateProperty(data.products)
          .then((products) => {
            form.success(
              res,
              {
                products: products,
                pageInfo: {
                  currentPage,
                  nextPage: currentPage == totalPage ? null : nextPage,
                  prevPage: currentPage == 1 ? null : prevPage,
                  totalPage,
                  query: "?" + remove4,
                },
              },
              "ambil"
            );
          })
          .catch((err) => {
            form.error(res, err);
          });
      })
      .catch((err) => {
        form.error(res, err);
      });
  },
  getProductById: (req, res) => {
    const { id } = req.params;

    productModel
      .getProductById(id)
      .then((product) => {
        productsModel
          .updatePropertyProduct(product)
          .then((product) => {
            form.success(res, product, "ambil");
          })
          .catch((e) => {
            form.error(res, e);
          });
      })
      .catch((e) => {
        form.error(res, e);
      });
  },
  insertProduct: (req, res) => {
    const { body } = req;
    const insertBody = {
      ...body,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    };

    const colors = body.product_colors;
    const sizes = body.product_sizes;

    delete insertBody.product_colors;
    delete insertBody.product_sizes;
    // console.log(body);
    // res.json(body);
    productModel
      .insertProduct(insertBody)
      .then((data) => {
        const imagesArr = req.files.map((i) => {
          const filepath = "/images/products/" + i.filename;
          return [data.insertId, filepath];
        });
        // console.log(imagesArr)
        // res.json(imagesArr)
        attrModel
          .insertUploadImages(imagesArr)
          .then(() => {
            productModel
              .insertBatch(colors, data.insertId, "product_colors")
              .then(() => {
                productModel
                  .insertBatch(sizes, data.insertId, "product_sizes")
                  .then(() => {
                    const resObj = {
                      msg: "Data berhasil dimasukkan",
                      data: {
                        id: data.insertId,
                        ...insertBody,
                        images: imagesArr,
                      },
                    };
                    res.json(resObj);
                  })
                  .catch((err) => {
                    form.error(res, err);
                  });
              })
              .catch((err) => {
                form.error(res, err);
              });
          })
          .catch((err) => {
            form.error(res, err);
          });
        // res.send(imagesArr)
      })
      .catch((e) => {
        form.error(res, e);
      });
  },
  insertProductAttr: async (req, res) => {
    const {
      params: { id, attr },
      body,
    } = req;
    const insertBody = {
      product_id: id,
      ...body,
    };

    try {
      let insert;
      if (attr == "color") {
        insert = await productModel.insertAttrProduct(
          insertBody,
          "product_colors"
        );
      } else if (attr == "size") {
        insert = await productModel.insertAttrProduct(
          insertBody,
          "product_sizes"
        );
      } else if (attr == "image") {
        insert = await productModel.insertAttrProduct(
          insertBody,
          "product_images"
        );
      } else {
        res.json({
          msg: "Attribut tidak ditemukan",
        });
      }

      const resObj = {
        msg: "Data berhasil dimasukkan",
        data: { id: insert.insertId, ...body },
      };
      res.json(resObj);
    } catch (e) {
      form.error(res, e);
    }
  },
  updateProduct: (req, res) => {
    const {
      params: { id },
      body,
    } = req;
    const insertBody = {
      ...body,
      updated_at: new Date(Date.now()),
    };
    productModel
      .updateProduct(id, insertBody, (req.files.length && req.files) || false)
      .then(() => {
        const resObj = {
          msg: "Data berhasil diupdte",
          data: insertBody,
        };
        res.json(resObj);
      })
      .catch((e) => {
        form.error(res, e);
      });
  },
  deleteProduct: (req, res) => {
    const { id } = req.params;

    productModel
      .deleteProduct(id)
      .then((data) => {
        form.success(res, data, "delete success");
        // return res.json({
        //   msg:
        //     data.affectedRow== 1
        //       ? "Data berhasil dihapus"
        //       : "Data tidak ditemukan",
        // });
      })
      .catch((e) => {
        form.error(res, e);
      });
  },
  deleteProductImage: (req, res) => {
    const { imageId, productId } = req.params;

    productModel
      .getProductImageById(imageId, productId)
      .then((data) => {
        console.log(data);
        productModel
          .deleteProductImageById(imageId, productId)
          .then(() => {
            if (data.length) {
              data.map((image) => {
                fs.unlink(".public/" + image.image_path, (err) => {
                  return form.error(res, err);
                });
              });
            }
            // fs.unlink('./public' + data[0].image_path, (err) => {
            // 	form.error(res, err)
            // })
            // res.setHeader("Content-Type", "text/html");
            return res.status(200).json({
              message: "data berhasil dihapus",
            });
            // return res.end();
          })
          .catch((err) => {
            form.error(res, err);
          });
      })
      .catch((err) => {
        form.error(res, err);
      });
  },
  testUrl: (req, res) => {
    res.status(401).send({
      bjir: "awwokaowkwoowkaokwok",
    });
  },
};
