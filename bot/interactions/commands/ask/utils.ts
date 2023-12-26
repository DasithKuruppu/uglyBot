export const extractImageUrlArray = (str, lower = false) => {
  const regexp = /\b((https?|ftp|file):\/\/|(www|ftp)\.)[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/ig;

  if (typeof str !== "string") {
    return [];
  }

  if (str) {
    let urls = str.match(regexp);
    if (urls) {
        return urls.map((url) => {
            return url.toString();
        });
    } else {
      return [];
    }
  } else {
    return [];
  }
};
