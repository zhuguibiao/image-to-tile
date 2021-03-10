const sharp = require("sharp");
const express = require("express");
const fs = require("fs");

const PORT = 8080;

const tile_opt = {
  layout: "google",
  background: { r: 0, g: 0, b: 0, alpha: 0 },
};

const get_file_name = (f) => f.replace(/(.*\/)*([^.]+).*/gi, "$2");

const getCallback = (req, res) => {
  const original_name = req.query.file_name;
  if (!original_name) {
    res.status(200).send("original_image is missing");
    return;
  }
  const file_name = get_file_name(original_name);
  const image = sharp(`files/input/${original_name}`, { limitInputPixels: 0 });

  const writeFile = (err, info) => {
    fs.writeFile(
      `files/output/${file_name}/info${info ? "info" : "error"}.json`,
      JSON.stringify(info || err),
      (error) =>
        console.log(
          `output ${file_name}:${JSON.stringify(error || err || info)}`
        )
    );
  };
  image
    .metadata()
    .then((metadata) => {
      res.status(200).send(metadata);
      image
        .png()
        .ensureAlpha()
        .tile(tile_opt)
        .toFile(`files/output/${file_name}`, writeFile);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send(err.message);
    });
};

const app = express();

app.use(express.static('./files/output'))

app.get("/original_image", getCallback);

app.listen(PORT, () => console.log(`tile server start`));
