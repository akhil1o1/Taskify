import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_CLOUD_NAME) {
   throw new Error("CLOUDINARY_CLOUD_NAME is not set");
}

if (!process.env.CLOUDINARY_FOLDER_NAME) {
   throw new Error("CLOUDINARY_FOLDER_NAME is not set");
}

if (!process.env.CLOUDINARY_API_KEY) {
   throw new Error("CLOUDINARY_API_KEY is not set");
}

if (!process.env.CLOUDINARY_API_SECRET) {
   throw new Error("CLOUDINARY_API_SECRET is not set");
}

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFile(file: File) {
   // Convert file to a data URI
   const fileData = await file.arrayBuffer();
   const mime = file.type;
   const encoding = "base64";
   const base64Data = Buffer.from(fileData).toString("base64");
   const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;

   const result = await cloudinary.uploader.upload(fileUri, {
      folder: process.env.CLOUDINARY_FOLDER_NAME,
   });

   return {
      fileUrl: result.secure_url,
      publicId: result.public_id,
   };
}

export async function deleteFiles(publicIds: string[]) {
   try {
      const result = await cloudinary.api.delete_resources(publicIds);
      return result;
   } catch (error) {}
}
