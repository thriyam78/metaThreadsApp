
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import UserCard from "@/components/cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import CommunityCard from "@/components/cards/CommunityCard";
async function Page() {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id);
    const onboardingStatus = userInfo?.onboarded
    if (!onboardingStatus) redirect("/onboarding")

    //Fetch users
    const result = await fetchCommunities({
        searchString: "",
        pageNumber: 1,
        pageSize: 25,
    })


    return (
        <section>
            <h1 className="head-text text-white mb-10">Search</h1>
            {/* <SearchBar> */}
            <div className="mt-14 flex flex-col gap-9">
                {result?.communities.length === 0 ? (<p className="no-result">no-communities found</p>) :
                    (<>
                        {result?.communities.map((community) => (
                            <CommunityCard
                                key={community.id}
                                id={community.id}
                                name={community.name}
                                username={community.username}
                                imgUrl={community.image}
                                bio={community.bio}
                                members={community.members}

                            />
                        ))}
                    </>)}
            </div>
        </section>
    )
}

export default Page;