const processFile = require("../middleware/upload");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "./learning-project-371406-672d1a24c693.json" });
const bucket = storage.bucket("learning-gcp-1");
//Connect to s3
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: 'AKIAW4FSNGLBMXBKIDU4',
    secretAccessKey: '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',
    region: 'ap-southeast-2'
  });

const s3 = new AWS.S3();

const transferGCPToS3 = async () => {
    const [files] = await bucket.getFiles();

for (const file of files) {
  const stream = file.createReadStream();
  
  s3.upload(
    {
      Bucket: 'my-s3-bucket',
      Key: file.name,
      Body: stream,
    },
    (err, data) => {
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
    }
  );
}
}

module.exports = {
    transferGCPToS3
}
