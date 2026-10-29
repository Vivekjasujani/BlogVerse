const calculateReadingTime = (html) => {
  const wordsPerMinute = 200;
  const text = String(html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .trim();
  const wordCount = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

export default calculateReadingTime;
