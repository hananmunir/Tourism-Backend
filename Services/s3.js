import S3 from "aws-sdk/clients/s3.js";
import fs from "fs";
import dotenv from "dotenv";

//congifure environment variables
dotenv.config();
const bucketname = process.env.S3_BUCKET_NAME;
const region = process.env.S3_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAcessKey = process.env.AWS_SECRET_ACCESS_KEY;

//create s3 object
const s3 = new S3({
  region,
  accessKeyId,
  secretAcessKey,
});

// uploads file to s3
export const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketname,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};

//downloads file from s3
export const getFileStream = (filekey) => {
  const downloadParams = {
    Bucket: bucketname,
    Key: filekey,
  };

  return s3.getObject(downloadParams).createReadStream();
};

// delets a file from s3
export const deleteFile = (filekey) => {
  var params = {
    Bucket: bucketname,
    Key: filekey,
  };

  s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack); // error
    else console.log(); // deleted
  });
};
