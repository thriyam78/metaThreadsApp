import { fetchUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs";
import UserCard from "../cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import CommunityCard from "../cards/CommunityCard";

async function RightSideBar() {
    const user = await currentUser();
    if (!user) return null;

    const result = await fetchUsers({
        userId: user.id,
        searchString: "",
        pageNumber: 1,
        pageSize: 25,
    })
    const results = await fetchCommunities({
        searchString: "",
        pageNumber: 1,
        pageSize: 25,
    })
    return (
        <section className="custom-scrollbar rightsidebar">
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-white">Suggested Communities</h3>
                <section>
                    {/* <SearchBar> */}
                    <div className="mt-5 flex flex-col gap-9">
                        {results?.communities.length === 0 ? (<p className="no-result">no-communities found</p>) :
                            (<>
                                {results?.communities.map((community) => (
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

            </div>
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-white">Suggested Users</h3>
                <section>
                    {/* <SearchBar> */}
                    <div className="mt-5 flex flex-col gap-9">
                        {result?.users.length === 0 ? (<p className="no-result">no-users found</p>) :
                            (<>
                                {result?.users.map((person) => (
                                    <UserCard
                                        key={person.id}
                                        id={person.id}
                                        name={person.name}
                                        username={person.username}
                                        imgUrl={person.image}
                                        personType='User' />
                                ))}
                            </>)}
                    </div>
                </section>
            </div>
        </section>)
}

export default RightSideBar;