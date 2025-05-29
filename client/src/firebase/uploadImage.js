import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

/**
 * Uploads an image file to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {Function} progressCallback - Callback function to track upload progress
 * @returns {Promise<string>} - A promise that resolves to the download URL of the uploaded image
 */
export const uploadImage = (file, progressCallback = () => {}) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    // Create a unique file name using timestamp and original name
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${file.name}`;
    
    // Create a reference to the file location in Firebase Storage
    const storageRef = ref(storage, `profile-images/${fileName}`);
    
    // Start the upload task
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register observers for the upload task
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Track upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressCallback(progress);
      },
      (error) => {
        // Handle errors
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        // Upload completed successfully, get download URL
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          console.error("Error getting download URL:", error);
          reject(error);
        }
      }
    );
  });
}; 