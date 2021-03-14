const form = require("../helpers/form");
const query = require("../helpers/concat");
const auth = require("../models/auth");
const authModel = require("../models/auth");
const nodemailer = require("nodemailer");
const { json } = require("express");

module.exports = {
  getUser: (req, res) => {
    const {
      params: { route, id },
      body,
    } = req;
    const availableTables = ["customers", "sellers"];

    if (availableTables.includes(route)) {
      authModel
        .getUserById(route, id)
        .then((data) => {
          form.success(res, data, "ambil");
        })
        .catch((e) => {
          form.error(res, e);
        });
    } else {
      form.error(res, "rute tidak ditemukan");
    }
  },
  registerUser: (req, res) => {
    const {
      params: { route },
      body,
    } = req;
    const availableTables = ["customer", "seller"];
    const insertBody = {
      ...body,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    };

    if (availableTables.includes(route)) {
      const table = route + "s";

      authModel
        .addNewUser(insertBody, table)
        .then(() => {
          res.json({
            status: 200,
            message: "User berhasil ditambahkan",
          });
        })
        .catch((err) => {
          form.error(res, err);
        });
    } else {
      form.error(res, "rute tidak ditemukan");
    }
  },
  loginUser: (req, res) => {
    const {
      params: { route },
      body,
    } = req;
    const availableTables = ["customer", "seller"];

    if (availableTables.includes(route)) {
      const table = route + "s";
      authModel
        .checkUserLogin(body, table)
        .then((data) => {
          authModel
            .insertToken({ token: data.token })
            .then(() => {
              form.success(res, data, "ambil");
            })
            .catch((err) => {
              return res.json({
                message: "Error",
                err,
              });
            });
        })
        .catch((err) => {
          res.json({
            err,
          });
        });
    } else {
      form.error(res, "rute tidak ditemukan");
    }
  },
  logoutUser: (req, res) => {
    // const { user_id } = req.params
    const bearerToken = req.header("x-access-token");

    if (!bearerToken) {
      return res.status(401).json({
        message: "Silahkan login dahulu",
      });
    } else {
      const token = bearerToken.split(" ")[1];

      authModel
        .deleteToken(token)
        .then((data) => {
          if (data.affectedRows === 0) {
            return res.json({
              isLogout: false,
              message: "User gagal logout",
            });
          }
          return res.json({
            isLogout: true,
            message: "User berhasil logout",
          });
        })
        .catch((err) => {
          res.json({
            isLogout: false,
            message: "User gagal logout",
            err,
          });
        });
    }
  },
  sendEmail: (req, res) => {
    const {
      params: { route },
      body,
    } = req;
    const availableTables = ["customer", "seller"];

    if (!body.user_email) {
      return form.error(res, "Please input email");
    }

    if (availableTables.includes(route)) {
      const table = route + "s";

      authModel
        .getUserByEmail(table, body.user_email)
        .then((data) => {
          const otp = query.generateOTP(6);
          const body = {
            otp,
            created_at: new Date(Date.now()),
            removed_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          };
          authModel
            .insertOTP(body)
            .then(() => {
              const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                  user: "elwanditirtana1945a@gmail.com",
                  pass: "ETDldTS123",
                },
              });

              const mailOptions = {
                from: "Admin Blanja",
                to: data.user_email,
                subject: "Code OTP",
                // text: "Your code OTP is " + otp,
                html: "<p>Your code OTP is <b>" + otp + "</b></p>",
              };

              transporter.sendMail(mailOptions, function (error, _) {
                if (error) {
                  res.send(error);
                } else {
                  form.success(res, data, "ambil");
                }
              });
            })
            .catch((err) => {
              form.error(res, err);
            });
        })
        .catch((error) => {
          return form.error(res, error);
        });
    } else {
      return res.json({
        err: "URL is error",
      });
    }
  },
  forgotPass: (req, res) => {
    const {
      params: { route },
      body,
    } = req;
    const availableTables = ["customer", "seller"];

    if (!body.user_email) {
      return form.error(res, "Please input email");
    }

    if (availableTables.includes(route)) {
      const table = route + "s";

      authModel
        .getUserByEmail(table, body.user_email)
        .then((data) => {
          const otp = query.generateOTP(6);
          const body = {
            otp,
            created_at: new Date(Date.now()),
            removed_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          };
          authModel
            .insertOTP(body)
            .then(() => {
              const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                  user: "elwanditirtana1945a@gmail.com",
                  pass: "ETDldTS321",
                },
              });

              const mailOptions = {
                from: "Admin Blanja",
                to: data.user_email,
                subject: "Code OTP",
                // text: "Your code OTP is " + otp,
                html: "<p>Your code OTP is <b>" + otp + "</b></p>",
              };

              transporter.sendMail(mailOptions, function (error, _) {
                if (error) {
                  res.send(error);
                } else {
                  form.success(res, data, "ambil");
                }
              });
            })
            .catch((err) => {
              form.error(res, err);
            });
        })
        .catch((error) => {
          return form.error(res, error);
        });
    } else {
      return res.json({
        err: "URL is error",
      });
    }
  },
  verifyOTP: (req, res) => {
    const { body } = req;

    if (!body.otp) {
      return form.error(res, "Please input otp");
    } else {
      authModel
        .getOTP(body.otp)
        .then((data) => {
          authModel
            .deleteOTP(data.otp)
            .then(() => {
              return res.send({
                message: "OTP is verified",
              });
            })
            .catch((err) => {
              return form.error(res, err);
            });
        })
        .catch((err) => {
          form.error(res, err);
        });
    }
  },
  resetPassword: (req, res) => {
    const { body } = req;

    if (!body.user_email || !body.role) {
      form.error(res, "Please fill the form");
    } else {
      authModel
        .resetPassword(body)
        .then(() => {
          res.send({
            message: "Reset password berhasil",
          });
        })
        .catch((err) => {
          form.error(res, err);
        });
    }
  },
};
