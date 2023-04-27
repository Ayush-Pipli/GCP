// const AWS = require("aws-sdk");
// const { format } = require('util');
// const KEY_ID = "AKIAVXLJDINHPHCOHUPI";
// const SECRET_KEY = "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";

// const BUCKET_NAME = "pipli-bucket-2";

// const s3 = new AWS.S3({
//     accessKeyId: KEY_ID,
//     secretAccessKey: SECRET_KEY
// });

// const params = {
//     Bucket: BUCKET_NAME
// }

// s3.createBucket(params, (err, data)=> {
//     if(err) {
//         console.log(err);
//     }
//     else {
//         console.log("Bucker created successfully", data.Location);
//     }
// })

// const uploadImage = (file, tenantId) => new Promise((resolve, reject) => {
//   const { originalname, buffer } = file
//     console.log(file)
//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: `${tenantId}/${originalname.replace(/ /g, "_")}`,
//     Body: buffer
//   };

//   s3.upload(params, (err, data) => {
//     if (err) {
//       reject(`Unable to upload image, something went wrong: ${err}`);
//     } else {
//       const publicUrl = format(
//         `https://${BUCKET_NAME}.s3.amazonaws.com/${tenantId}/${originalname.replace(/ /g, "_")}`
//       );
//       resolve(publicUrl);
//     console.log("file uploaded successfuly", data.Location);
//     }
//   });
// });

// const getListLogoFiles = async function(tenantId){
//   const params = {
//     Bucket: BUCKET_NAME,
//     Prefix: `${tenantId}/`,
//     MaxKeys: 1000
//   };
//   const result = await s3.listObjectsV2(params).promise();
//   return result.Contents;
// };

// const deleteFile = async function(fileName) {
//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: fileName
//   };
//   s3.deleteObject(params, (err, data) => {
//     if(err) {
//         console.log("Error deleting file: ", err)
//     }
//     else {
//         console.log("file deleted successfully: ", data)
//     }
//   });
// };

// module.exports = {
//   uploadImage,
//   getListLogoFiles,
//   deleteFile
// };