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
  return "https://small-piano-tap-actual.trycloudflare.com";
};
