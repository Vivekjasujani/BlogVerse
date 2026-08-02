import React, { useCallback, useEffect, useState } from 'react'
import { RTE, Button, Input, Loader } from "../index"
import postService from "../../api/postService"
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({ post }) {
    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { register, handleSubmit, watch, setValue, getValues, control } = useForm({
        defaultValues: { title: post?.title || "", slug: post?.slug || "", content: post?.content || "", status: post?.status || "active", author: userData.name }
    })
    const submit = async (data) => {
        setLoading(true)
        setError("")
        try {
            const values = { ...data, image: data.image[0] }
            const dbPost = post
                ? await postService.updatePost(post.$id, values)
                : await postService.createPost(values)
            if (dbPost) navigate(`/post/${dbPost.slug}`)
        } catch (error) {
            setError(error.response?.data?.message || error.message)
        } finally { setLoading(false) }
    }
    const slugTransform = useCallback((value) => value && typeof value === "string" ? value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-").replace(/\s/g, "-") : "", [])
    useEffect(() => {
        const subscription = watch((value, { name }) => { if (name === "title") setValue("slug", slugTransform(value.title), { shouldValidate: true }); });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);
    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            {error && <div className="w-full px-2 mb-4 text-red-500 text-center">{error}</div>}
            <div className="w-full lg:w-2/3 px-2">
                <Input label={<>Title <span className='text-red-500'>*</span>:</>} placeholder="Title" className="mb-4 border border-gray-600 text-white rounded-lg bg-black focus:bg-black focus:outline focus:ring-none" style={{'backgroundColor': 'black', 'color': 'white'}} {...register("title", { required: true })} />
                <Input label={<>Slug <span className='text-red-500'>*</span>:</>} placeholder="Slug" className="mb-4 border border-gray-600 text-white rounded-lg bg-black focus:bg-black focus:outline focus:ring-none" style={{'backgroundColor': 'black', 'color': 'white'}} {...register("slug", { required: true })} onInput={(e) => setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })} />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                <div className='mt-4'><Input label="Author :" placeholder="Author" style={{'backgroundColor': 'black', 'color': 'white'}} className="mb-4 border border-gray-600 text-white rounded-lg bg-black focus:bg-black focus:outline focus:ring-none cursor-not-allowed" {...register("author")} disabled /></div>
            </div>
            <div className="w-full lg:w-1/3 px-2">
                <Input label={<>Featured Image <span className='text-red-500'>*</span>:</>} type="file" style={{'backgroundColor': 'black', 'color': 'white'}} className="mb-4 border border-gray-600 text-white rounded-lg bg-black focus:bg-black focus:outline focus:ring-none" accept="image/png, image/jpg, image/jpeg, image/gif" {...register("image", { required: !post })} />
                {post && <div className="w-full mb-4"><img src={post.featuredImage} alt={post.title} className="rounded-lg" /></div>}
                {loading ? <div className='w-full grid place-items-center'><Loader /></div> : <Button type="submit" bgColor={post ? "bg-green-500" : "bg-customPurple"} className={` ${post ? "  hover:shadow-green-500 text-black " : " hover:shadow-customPurple text-white "} shadow-sm hover:cursor-pointer duration-200 hover:drop-shadow-2xl rounded-lg w-full`}>{post ? "Update" : "Submit"}</Button>}
            </div>
        </form>
    )
}
export default PostForm