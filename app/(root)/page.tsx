
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

async function Home() {
  const result = await fetchPosts({ pageNumber: 1, pageSize: 30 });
  const user = await currentUser();
  return (

    <>
      <h1 className="head-text text-left">Home</h1>
      <section className='mt-9 flex flex-col gap-10'>
        {result.posts.length === 0 ? (
          <p className='no-result'>No threads found</p>
        ) : (
          <><div className="mt-5 flex flex-col gap-10">
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children} />
            ))}
          </div></>
        )}
      </section>
    </>


  )
}

export default Home