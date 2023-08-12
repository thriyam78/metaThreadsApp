import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import UserCard from "@/components/cards/UserCard";
import Link from "next/link";
async function Page() {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id);
    const onboardingStatus = userInfo?.onboarded
    if (!onboardingStatus) { redirect("/onboarding"); return null; }
    //get Activity

    const activity = await getActivity(userInfo._id);
    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>
            <section className="mt-10 flex flex-col gap-5">
                <>
                    {activity && activity.length > 0 ? (
                        activity.map((a) => (
                            <Link key={a._id} href={`/thread/${a.parentId}`}>
                                <article className="activity-card">
                                    <Image src={a.author.image}
                                        alt="Profile Picture"
                                        height={28}
                                        width={28}
                                        className="rounded-full object-cover"
                                    />
                                    <p className="!text-small-regular text-white">
                                        <span className="mr-1 text-primary-500">
                                            {a.author.name}
                                        </span>{" "}
                                        Replied to your Thread
                                    </p>

                                </article>
                            </Link>
                        ))
                    ) : (
                        <p className="!text-base-regular text-light-3">No Activity</p>
                    )}
                </>
            </section>
        </section>
    )
}
export default Page;