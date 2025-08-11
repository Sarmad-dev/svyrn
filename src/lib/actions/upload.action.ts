// This file is no longer needed for direct Cloudinary uploads
// Images are now handled through the campaign creation endpoint
// which uploads base64 data to Cloudinary on the backend

export const uploadToCloudinary = async (file: File): Promise<string> => {
  // This function is deprecated - images are now uploaded through campaign creation
  throw new Error('Direct Cloudinary upload is deprecated. Use campaign creation endpoint instead.');
};
