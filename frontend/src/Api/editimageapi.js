export const editimageapi = (url, fallbackImage = null) => {
  if (!url) return fallbackImage;

  try {
    // Loại bỏ https và port :443
    const cleanUrl = url.replace("https://", "http://").replace(":443", "");

    return cleanUrl;
  } catch (error) {
    console.error("Error processing image URL:", error);
    return fallbackImage;
  }
};
export const getBaseImageUrl = () => {
  // Lấy từ baseURL của axios instance
  return "http://0d9ffd8a6329.ngrok-free.app";
};
