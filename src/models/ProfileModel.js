const db = require("../configs/mySQL");
const qs = require("../helpers/Query");

module.exports = {
  // updatePhoto: (file, id) => {},
  getActiveAddress: (id, idAddress) => {
    return new Promise((resolve, reject) => {
      const q = `SELECT * FROM customers AS c JOIN address AS a ON a.user_id = c.user_id WHERE a.user_id =${id} AND a.id = ${idAddress}`;
      db.query(q, (err, data) => {
        if (!err) {
          resolve(data[0]);
        } else {
          reject(err);
        }
      });
    });
  },
  insertReview: (body) => {
    return new Promise((resolve, reject) => {
      const q = "INSERT INTO reviews SET ?";
      db.query(q, body, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  },
  updateUsername: (table, name, id) => {
    return new Promise((resolve, reject) => {
      const q = `UPDATE ${table} SET user_name='${name}' WHERE user_id='${id}'`;
      db.query(q, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  },
  getEachRating: (product_id) => {
    return new Promise((resolve, reject) => {
      const q = `SELECT (SELECT COUNT(review_rating) FROM reviews WHERE product_id = ${product_id} AND review_rating = 5) AS five, (SELECT COUNT(review_rating) FROM reviews WHERE product_id = ${product_id} AND review_rating = 4) AS four, (SELECT COUNT(review_rating) FROM reviews WHERE product_id = ${product_id} AND review_rating = 3) AS three, (SELECT COUNT(review_rating) FROM reviews WHERE product_id = ${product_id} AND review_rating = 2) AS two, (SELECT COUNT(review_rating) FROM reviews WHERE product_id = ${product_id} AND review_rating = 1) AS one FROM reviews WHERE product_id = ${product_id} LIMIT 1`;
      db.query(q, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  },
  getAllReview: (product_id) => {
    return new Promise((resolve, reject) => {
      const q = `SELECT r.review_id, r.user_id, r.review_comment, r.created_at, c.user_name, c.user_email, c.user_image FROM reviews AS r JOIN customers AS c ON r.user_id = c.user_id WHERE product_id = ${product_id}`;
      db.query(q, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  },
  updatePhoto: (table, image, id) => {
    return new Promise((resolve, reject) => {
      const q = `UPDATE ${table} SET user_image='${image}' WHERE user_id='${id}'`;
      db.query(q, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  },
};
