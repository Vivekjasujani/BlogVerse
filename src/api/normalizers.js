export function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    $id: user._id,
    $createdAt: user.createdAt,
    $updatedAt: user.updatedAt,
  };
}

export function normalizePost(post) {
  if (!post) return null;
  const author = typeof post.author === "object" ? post.author : null;
  return {
    ...post,
    $id: post._id,
    slug: post.slug,
    $createdAt: post.createdAt,
    $updatedAt: post.updatedAt,
    author: author?.name || post.authorName || "Unknown author",
    userId: author?._id || post.author,
    featuredImage: post.featuredImage?.url || post.featuredImage,
    likes: post.likesCount ?? 0,
  };
}
