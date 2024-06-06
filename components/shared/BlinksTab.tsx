import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import BlinkCard from "../cards/BlinkCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const BlinksTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result = await fetchUserPosts(accountId);

  if (!result) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.blinks.map((blink: any) => {
        return (
          <BlinkCard
            key={blink._id}
            id={blink._id}
            currentUserId={currentUserId}
            parentId={blink.parentId}
            content={blink.text}
            author={
              accountType === "User"
                ? { name: result.name, image: result.image, id: result.id }
                : {
                    name: blink.author.name,
                    image: blink.author.image,
                    id: blink.author.id,
                  }
            }
            createdAt={blink.createdAt}
            community={blink.community}
            comments={blink.children}
          />
        );
      })}
    </section>
  );
};

export default BlinksTab;
