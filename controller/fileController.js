const processFile = require("../middleware/upload");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "./learning-project-371406-672d1a24c693.json" });
const bucket = storage.bucket("learning-gcp-1");
//Connect to azure
const { BlockBlobClient } = require("@azure/storage-blob");
require("dotenv").config();
const {transferGCPToAzure } = require('./transfer');


const upload = async (req, res) => {
  try {
    await processFile(req, res);

    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file('folder1/' + 'folder2/' + 'folder3/' + 'folder4/' + req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", async (data) => {
      // Create URL for directly file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );

      try {
        // Make the file public
        await bucket.file('folder1/' + 'folder2/' + 'folder3/' + 'folder4/' + req.file.originalname).makePublic();
      } catch {
        return res.status(500).send({
          message:
            `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
          url: publicUrl,
        });
      }

      res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.originalname,
        url: publicUrl,
      });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(500).send({
          message: "File size cannot be larger than 2MB!",
        });
      }
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};


const listFiles = async () => {
  // Lists files in the bucket
  const [files] = await storage.bucket("learning-gcp-1").getFiles();

  console.log('Files:');
  files.forEach(file => {
    console.log(file.name);
  });
}

const makePublicFunction = async (bucketName , fileName) => {
  await storage.bucket(bucketName).file(fileName).makePublic();

  console.log(`gs://${bucketName}/${fileName} is now public.`);
}

const transfer = async () => {

  
  const [files] = await bucket.getFiles();
      //let fileInfos = [];
  
      files.forEach(async (file) => {
        
        
        transferGCPToAzure(file.metadata.mediaLink , file.name)
      });

}

const uploadfile = async (file , container_name) => {

  const getStream = await import('into-stream');
  const {nanoid} = await import('nanoid');

    const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=pipliinternalportal;AccountKey=KbbDxAFwPASdsErJFQcBMmj9JgVCGFOUmvXWFthP9fYchEfoSpbsPb4QGlNZEiHQtdrlLgb8G/il+ASt+tREmw==;EndpointSuffix=core.windows.net";
    
    if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw Error('Azure Storage Connection string not found');
    }
    
        const
        containerName = container_name
        console.log(file)
      , blobName = nanoid(14) + '-' + file.name
      , blobService = new BlockBlobClient(AZURE_STORAGE_CONNECTION_STRING,containerName,blobName)
      , stream = getStream.default(file.buffer)
      , streamLength = file.buffer.length
  ;
  console.log(blobName);

 let response = await blobService.uploadStream(stream, streamLength)
  .then(
      ()=>{
       console.log("File uploaded..")
      }
  ).catch(
      (err)=>{
      console.log(err)
  })
  return ({
    status: true,
    url: blobService.url
  });

}


const getListFiles = async (req, res) => {
    try {
      const [files] = await bucket.getFiles();
      let fileInfos = [];
  
      files.forEach((file) => {
        fileInfos.push({
          name: file.name,
          url: file.metadata.mediaLink,
        });
      });
  
      res.status(200).send(fileInfos);
    } catch (err) {
      console.log(err);
  
      res.status(500).send({
        message: "Unable to read list of files!",
      });
    }
  };
  
  const download = async (req, res) => {
    try {
      const [metaData] = await bucket.file(req.params.name).getMetadata();
      // console.log([metaData]);
      // console.log(metaData.mediaLink)
      res.redirect(metaData.mediaLink);
      
    } catch (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  };

  // const download = async (req , res) => {
    
  //   const fileName = req.params.name
  //   console.log(fileName)
  //   const options = {
  //     destination: '/local/path/to/file.jpeg',
  //   };
  
  //   // Downloads the file
  //   await storage.bucket(bucket).file(fileName).download(options);
  
  //   console.log(
  //     `gs://learning-gcp-1/${fileName} downloaded to ${options.destination}.`
  //   );
  // }
  

module.exports = {
  upload,
  getListFiles,
  download,
  listFiles,
  transfer,
  makePublicFunction
};