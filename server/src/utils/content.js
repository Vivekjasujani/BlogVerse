import sanitizeHtml from "sanitize-html";

export function sanitizePostContent(content) {
  return sanitizeHtml(content, {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "blockquote", "pre", "code",
      "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "a", "img", "table",
      "thead", "tbody", "tr", "th", "td", "hr", "span", "div",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "width", "height"],
      "*": ["style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"] },
  });
}
