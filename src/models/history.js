const db = require("../configs/dbconnection");
const qs = require("../helpers/query");

const getDetailByHistoryId = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      qs.queryGet("detail_histories", "*", `WHERE history_id=${id}`),
      (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      }
    );
  });
};

module.exports = {
  getAllHistory: () => {
    return new Promise((resolve, reject) => {
      db.query(qs.queryGet("histories", "*"), (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  },
  updateHistoryAttribute: async (data) => {
    try {
      for (let i = 0; i < data.length; i++) {
        const detailItems = await getDetailByHistoryId(data[i].history_id);

        data[i].products = detailItems;
      }
      return data;
    } catch (e) {
      return e;
    }
  },
  getHistoryById: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        qs.queryGet("histories", "*", `WHERE history_id=${id}`),
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
  getHistoryByUserId: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        qs.queryGet(
          "histories",
          "*",
          `WHERE user_id=${id} ORDER BY history_id DESC`
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
  insertHistory: (body) => {
    return new Promise((resolve, reject) => {
      const queryS = "INSERT INTO histories SET ?";
      db.query(queryS, body, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  },
  insertDetailHistory: (body, id) => {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < body.length; i++) {
        const insert = {
          product_id: body[i].product_id,
          product_title: body[i].product_title,
          brand_name: body[i].brand_name,
          product_image: body[i].img,
          product_color: body[i].color,
          product_size: body[i].size,
          product_qty: body[i].qty,
          product_subtotal: body[i].qty * body[i].product_price,
        };
        const queryS = `INSERT INTO detail_histories SET history_id=${id}, ?`;
        db.query(queryS, insert, (err, data) => {
          if (err) {
            reject(err);
          }
        });
      }
      resolve({ msg: "success" });
    });
  },
  insertSelectProductUser: (user_id, history_id) => {
    return new Promise((resolve, reject) => {
      const queryS = `INSERT INTO detail_histories(history_id, product_id, product_color_id, product_size_id, product_qty, product_subtotal) SELECT ${history_id},product_id,product_color_id,product_size_id,product_qty,product_subtotal FROM cart WHERE user_id=${user_id}`;
      db.query(queryS, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  },
};
