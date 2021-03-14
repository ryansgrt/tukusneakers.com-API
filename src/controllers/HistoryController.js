const historyModel = require("../models/history");
const cartModel = require("../models/cart");
const form = require("../helpers/form");

module.exports = {
  getAllHistory: (_, res) => {
    historyModel
      .getAllHistory()
      .then(async (histories) => {
        const detailHistories = await historyModel.updateHistoryAttribute(
          histories
        );

        form.success(res, detailHistories, "ambil");
      })
      .catch((e) => {
        form.error(res, e);
      });
  },
  getHistoryById: (req, res) => {
    const { id } = req.params;

    historyModel
      .getHistoryById(id)
      .then(async (history) => {
        const detailHistories = await historyModel.updateHistoryAttribute(
          history
        );

        form.success(res, detailHistories, "ambil");
      })
      .catch((e) => {
        form.error(res, e);
      });
  },
  getHistoryByUserId: (req, res) => {
    const { user_id } = req.params;

    historyModel
      .getHistoryByUserId(user_id)
      .then(async (history) => {
        const detailHistories = await historyModel.updateHistoryAttribute(
          history
        );

        form.success(res, detailHistories, "ambil");
      })
      .catch((e) => {
        form.error(res, e);
      });
  },
  insertHistory: async (req, res) => {
    const { body } = req;

    const historyBody = {
      user_id: body.user_id,
      history_code: Math.random().toString(36).substring(2, 15),
      history_address: body.address,
      history_method: body.method,
      history_subtotal: body.subtotal,
      coupon: body.code,
      seller_id: body.seller,
      created_at: new Date(Date.now()),
    };

    historyModel
      .insertHistory(historyBody)
      .then((history) => {
        // console.log(body.items);
        // console.log(history.insertId);
        historyModel
          .insertDetailHistory(body.items, history.insertId)
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send({ err });
          });
      })
      .catch((err) => {
        res.send({ err });
      });
  },
};
