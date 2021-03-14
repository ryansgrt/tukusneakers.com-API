const profileModel = require("../models/profile");
const form = require("../helpers/form");
const fs = require("fs");

module.exports = {
  updatePhoto: (req, res) => {
    const { body, file } = req;

    const image = "/images/profile/" + file.filename;
    profileModel
      .updatePhoto(body.role, image, body.user_id)
      .then(() => {
        if (body.latest !== "/images/profile/user.png") {
          fs.unlink("./public" + body.latest, (err) => {
            if (err) {
              form.error(res, err);
            } else {
              form.success(res, "success update", "update");
            }
          });
        } else {
          form.success(res, "success update", "update");
        }
      })
      .catch((e) => {
        form.error(res, e);
      });
  },
  getUserAndAddress: (req, res) => {
    const {
      params: { id, id_address },
    } = req;

    profileModel
      .getActiveAddress(id, id_address)
      .then((data) => {
        form.success(res, data, "ambil");
      })
      .catch((e) => {
        form.error(res, e);
      });
  },
  getReview: (req, res) => {
    const { id } = req.params;

    profileModel
      .getEachRating(id)
      .then((ratings) => {
        profileModel
          .getAllReview(id)
          .then((reviews) => {
            form.success(
              res,
              {
                ratings: ratings.length ? ratings[0] : "kosong",
                reviews: reviews.length ? reviews : "kosong",
              },
              "ambil"
            );
          })
          .catch((e) => {
            form.error(res, e);
          });
      })
      .catch((e) => {
        form.error(res, e);
      });
  },
  addReview: (req, res) => {
    const { body } = req;

    profileModel
      .insertReview(body)
      .then(() => {
        form.success(res, "success insert", "tambah");
      })
      .catch((e) => {
        form.error(res, e);
      });
  },
  changeUsername: (req, res) => {
    const {
      body,
      params: { id },
    } = req;

    profileModel
      .updateUsername(body.role, body.user_name, id)
      .then(() => {
        form.success(res, "success update", "update");
      })
      .catch((e) => {
        form.error(res, e);
      });
  },
};
