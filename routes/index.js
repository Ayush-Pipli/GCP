const express = require("express");
const router = express.Router();
const controller = require("../controller/fileController");
const { transferGCPToS3 } = require("../controller/transferToS3");

let routes = (app) => {
  router.post("/upload", controller.upload);
  router.get("/files", controller.getListFiles);
  router.get("/files/:name", controller.download);
  router.get("/transfer" , transferGCPToS3)

  app.use(router);
};

module.exports = routes;