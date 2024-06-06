import BlinkCard from "@/components/cards/BlinkCard";
import Comment from "@/components/forms/Comment";
import { fetchBlinkById } from "@/lib/actions/blink.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const blink = await fetchBlinkById(params.id);

  return (
    <section className="relative">
      <div>
        <BlinkCard
          key={blink._id}
          id={blink._id}
          currentUserId={user?.id || ""}
          parentId={blink.parentId}
          content={blink.text}
          author={blink.author}
          createdAt={blink.createdAt}
          community={blink.community}
          comments={blink.children}
        />
      </div>
      <div className="mt-7">
        <Comment
          blinkId={blink.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {blink.children.map((childItem: any) => (
          <BlinkCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={childItem?.id || ""}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            createdAt={childItem.createdAt}
            community={childItem.community}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
