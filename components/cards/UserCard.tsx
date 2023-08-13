"use client"
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
    id: string;
    name: string;
    username: string;
    imgUrl: string;
    personType: string;
}

const UserCard = ({ id, name, username, imgUrl, personType }: Props) => {
    const router = useRouter()
    return (
        <article className="user-card">
            <div className="user-card_avatar">
                <Image src={imgUrl} alt="logo" height={48} width={48} className="rounded-full" />
                <div className="flex-1 text-ellipsis">
                    <h4 className="text-base-semibold text-light-1">{name}</h4>
                    <p className="text-small-medium text-gray-1">@{username}</p>
                </div>
            </div>
            <Link href={`/profile/${id}`}>
                <Button className="user-card_btn">
                    View
                </Button>
            </Link>
        </article>

    )

}

export default UserCard;