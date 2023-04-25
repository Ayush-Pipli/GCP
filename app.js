const cors = require("cors");
const express = require("express");
const app = express();
const {listFiles , transfer} = require('./controller/fileController');
const {transferGCPToAzure } = require('./controller/transfer');
let corsOptions = {
  origin: "http://localhost:8080",
};

app.use(cors(corsOptions));
listFiles();
//transfer();
//transferGCPToAzure("https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fairplane&psig=AOvVaw1ZrY9AoicZwH9C1eAsLqfj&ust=1671264029978000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCOinhejV_fsCFQAAAAAdAAAAABAE")


const initRoutes = require("./routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

const port = 8080;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});