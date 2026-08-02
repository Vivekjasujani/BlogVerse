import api from "./client";
import { normalizePost, normalizeUser } from "./normalizers";

function toFormData({ title, content, status, image }) {
  const formData = new FormData();
  if (title !== undefined) formData.append("title", title);
  if (content !== undefined) formData.append("content", content);
  if (status !== undefined) formData.append("status", status);
  if (image) formData.append("image", image);
  return formData;
}

const postService = {
  async getPosts(page = 1) {
    const { data } = await api.get("/posts", { params: { page } });
    return { ...data, documents: data.posts.map(normalizePost) };
  },

  async getPost(slug) {
    const { data } = await api.get(`/posts/${slug}`);
    return normalizePost(data.post);
  },

  async createPost(values) {
    const { data } = await api.post("/posts", toFormData(values), {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizePost(data.post);
  },

  async updatePost(postId, values) {
    const { data } = await api.patch(`/posts/${postId}`, toFormData(values), {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizePost(data.post);
  },

  async deletePost(postId) {
    await api.delete(`/posts/${postId}`);
    return true;
  },

  async toggleLike(postId) {
    const { data } = await api.post(`/posts/${postId}/like`);
    return data;
  },

  async getLikeStatus(postId) {
    const { data } = await api.get(`/posts/${postId}/like`);
    return data.liked;
  },

  async getProfile(userId) {
    const { data } = await api.get(`/profiles/${userId}`);
    return { user: normalizeUser(data.user), stats: data.stats };
  },

  async updateMyProfile(values) {
    const { data } = await api.patch("/profiles/me", values);
    return normalizeUser(data.user);
  },

  async getUserPosts(userId) {
    const { data } = await api.get(`/profiles/${userId}/posts`);
    return data.posts.map(normalizePost);
  },

  async getMyLikedPosts() {
    const { data } = await api.get("/profiles/me/liked-posts");
    return data.posts.map(normalizePost);
  },
};

export default postService;
