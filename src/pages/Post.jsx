import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import postService from "../api/postService";
import { Button, Container } from "../Components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import MiniLoader from "../Components/MiniLoader";
import { GoBack } from "../Components/ui/goBack.jsx";
import UserProfilePhoto from "../Components/ui/userProfilePhoto.jsx";
import calculateReadingTime from "../utils/readingTime.js";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

export default function Post() {
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;
  const readingTime = calculateReadingTime(post?.content);

  useEffect(() => {
    const load = async () => {
      try {
        const nextPost = await postService.getPost(slug);
        setPost(nextPost);
        setLikesCount(nextPost.likes || 0);
        if (userData) {
          setLiked(await postService.getLikeStatus(nextPost.$id));
        }
      } catch {
        navigate("/");
      }
    };
    if (slug) load();
    else navigate("/");
  }, [slug, navigate, userData]);

  const handleLike = async () => {
    if (!userData || !post) return navigate("/login");
    setLoading(true);
    try {
      const result = await postService.toggleLike(post.$id);
      setLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (error) {
      console.error("Error liking the post:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async () => {
    try {
      await postService.deletePost(post.$id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return post ? (
    <div className="py-8 flex flex-col justify-center items-center">
      <div className="max-w-[57rem]">
        <Container>
          <div className="flex justify-between">
            <GoBack />
            {isAuthor && (
              <div className="flex items-center">
                <Link to={`/edit-post/${post.slug}`}>
                  <Button className="rounded-lg py-1 hover:text-gray-400 flex items-center gap-1">
                    <CiEdit /> Edit
                  </Button>
                </Link>
                <Button 
                  className="rounded-lg py-1 hover:text-gray-400 flex items-center gap-1" 
                  onClick={deletePost}
                >
                  <MdDeleteOutline /> Delete
                </Button>
              </div>
            )}
          </div>
          <div className="w-full flex justify-center mb-4 relative max-h-80">
            <img 
              src={post.featuredImage} 
              alt={post.title} 
              className="rounded-lg object-cover" 
            />
          </div>
          <div className="w-full mb-6">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <div className="flex justify-between">
              <div className="text-gray-400 flex items-center justify-center gap-2 my-2">
                <UserProfilePhoto userId={post.userId} userName={post.author} />
                <div className="flex flex-col">
                  <p>by {post.author}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(post.$createdAt).toLocaleDateString('en-US', { 
                      day:'2-digit', 
                      month:'short', 
                      year:'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-400 flex items-center px-5 py-2 rounded-md my-5">
                {readingTime} min Read
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                className="flex items-center gap-3 sm:text-xl text-md px-3 py-1 lg:py-1 my-3 rounded-md bg-gray-800" 
                onClick={handleLike}
              >
                <FontAwesomeIcon 
                  icon={faHeart} 
                  className={liked ? "text-red-500" : "text-gray-400"} 
                />
                {loading ? (
                  <MiniLoader />
                ) : (
                  <p className="text-gray-300 text-sm">{likesCount}</p>
                )}
              </Button>
            </div>
          </div>
          <div className="browser-css text-left leading-relaxed">
            {parse(String(post.content))}
          </div>
        </Container>
      </div>
    </div>
  ) : null;
}