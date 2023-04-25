const fetch = require("node-fetch");
const { BlobServiceClient } = require("@azure/storage-blob");
const mime = require("mime");

const AZURE_STORAGE_CONNECTION_STRING ="DefaultEndpointsProtocol=https;AccountName=pipliinternalportal;AccountKey=KbbDxAFwPASdsErJFQcBMmj9JgVCGFOUmvXWFthP9fYchEfoSpbsPb4QGlNZEiHQtdrlLgb8G/il+ASt+tREmw==;EndpointSuffix=core.windows.net"


const transferGCPToAzure = async function (fileUrl , nameOfFile) {
  const extractedNameOfFile = nameOfFile.split("/");
  console.log(extractedNameOfFile)
  const files = fileUrl;
  
  const requestOptions = {
    method: "GET",
  };


  const response = await fetch(files, requestOptions);

  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`);

  let blobName = '';
  if (extractedNameOfFile.length === 1){
    blobName += extractedNameOfFile[0];
  }
  else {
    for (let i = 0; i < extractedNameOfFile.length; i++){
        if (i === extractedNameOfFile.length - 1){
            blobName += extractedNameOfFile[i];
        }
        else {
        blobName += extractedNameOfFile[i] + '/';
        }
   }
  }

  console.log(blobName);
  const blobServiceClient = await BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );

  const containerClient = await blobServiceClient.getContainerClient("test");
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const uploadBlobResponse = await blockBlobClient.uploadStream(
    response.body,
    4 * 1024 * 1024,
    20,
    {
      blobHTTPHeaders: {
        blobContentType: mime.getType(blobName),
      },
    }
  );
  console.log(uploadBlobResponse._response.status)
  //context.res = { body: uploadBlobResponse._response.status };
};

module.exports = {
    transferGCPToAzure
}