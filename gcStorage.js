const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  keyFilename: process.env.GOOGLE_STORAGE_CREDENTIALS_PATH,
});

const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET_NAME);

const uploadImage = async (file, id) => {
  const blob = bucket.file(`${id}_${Date.now()}.jpg`);
  const blobStream = blob.createWriteStream();

  // Create a promise to handle the completion of blobStream
  const uploadPromise = new Promise((resolve) => {
    blobStream.on('finish', () => {
      console.log('Upload successful');
      resolve(); // Resolve the promise when the upload is complete
    });
  });

  // Start the file upload
  blobStream.end(file.buffer);

  // Wait for the upload to complete before continuing
  await uploadPromise;

  // Now that the upload is complete, get the files
  const files = await bucket.getFiles();
  console.log(files[0][files[0].length - 1]);

  const imageId = files[0][files[0].length - 1].id;

  const publicUrl = `https://storage.googleapis.com/properteez_bucket/${imageId}`
  return publicUrl;
};



module.exports = uploadImage;