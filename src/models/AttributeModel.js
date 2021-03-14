const db = require("../configs/mySQL");


module.exports = {
    getDataBytTable: (table) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT & FROM ${table}`, (err, data) => {
                if (!err) {
                    resolve(data);
                } else {
                    reject(err);
                }
            })
        })
    },

    insertUploadImages: (images) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO product_images (product_id, image_path) VALUES ?`,
                [images],
                (err, data) => {
                    if (err) {
                        reject(err)
                    }
                }
            );
            resolve(true)
        });
    },


    getProductAttributebyQuery: (qs) => {
        return new Promise((resolve, reject) => {
            db.query(qs, (err, data) => {
                if (!err) {
                    resolve(data);
                } else {
                    reject(err);
                }
            })
        })
    },

    getAddressByUser: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM address WHERE user_id = ${id} ORDER BY id DESC`,
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

    insertAddress: (body) => {
        return new Promise((resolve, reject) => {
            const queryS = `INSERT INTO address SET ?`;
            db.query(queryS, body, (err, data) => {
                if (!err) {
                    resolve(data);
                } else {
                    reject(err);
                }
            });
        });
    },

    updateAddress: (id, body) => {
        return new Promise((resolve, reject) => {
            const queryS = `UPDATE address SET ? WHERE id=${id}`;
            db.query(queryS, body, (err, data) => {
                if (!err) {
                    resolve(data);
                } else {
                    reject(err);
                }
            })
        })
    },

    deleteAddress: (id) => {
        return new Promise((resolve, reject) => {
            const queryS = `DELETE FROM address WHERE id=${id}`;
            db.query(queryS, body, (err, data) => {
                if (!err) {
                    resolve(data);
                } else {
                    reject(err);
                }
            })
        })
    },

    updateUserAddress: (idUser, idAddress) => {
        return new Promise((resolve, reject) => {
            const queryS = `UPDATE customers SET id_address=${idAddress} WHERE user_id=${idUser}`;
            db.query(queryS, (err, data) => {
                if(!err){
                    resolve(data);
                } else {
                    reject(err);
                }
            })
        })
    }
}
