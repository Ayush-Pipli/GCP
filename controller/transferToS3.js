const processFile = require("../middleware/upload");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "./learning-project-371406-672d1a24c693.json" });
const srcBucketName = storage.bucket("learning-gcp-1");
//Connect to s3
const AWS = require('aws-sdk');
const { uploadImage } = require("./awsHelper");

const s3 = new AWS.S3({
    accessKeyId: 'AKIAVXLJDINHPHCOHUPI',
    secretAccessKey: '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',
});
const destBucketName = "pipli-bucket-2";
const params = {
    Bucket: destBucketName
}

// s3.createBucket(params, (err, data)=> {
//     if(err) {
//         console.log(err);
//     }
//     else {
//         console.log("Bucker created successfully", data.Location);
//     }
// })

const transferGCPToS3 = async (req , res) => {
    try {
        // Get a list of all objects in the source bucket
        const [srcBucketFiles] = await storage.bucket("learning-gcp-1").getFiles();
        // Loop through each object and copy it to the destination bucket
        for (const file of srcBucketFiles) {
        const destKey = file.name;
        console.log(destKey)
        const params = {
            Bucket: destBucketName,
            Key: destKey,
            Body: file.createReadStream(),
        };
        await s3.upload(params).promise();
        
        }
        return res.status(200).send({status:true , message: "SUCCESS"})
    } 
    catch (e){
        console.log(e);
        return res.status(500).send({status:false , message: "ERROR"})
    }
}

module.exports = {
    transferGCPToS3
}
