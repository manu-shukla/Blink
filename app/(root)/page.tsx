import BlinkCard from "@/components/cards/BlinkCard";
import { fetchBlinks } from "@/lib/actions/blink.actions";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  const result = await fetchBlinks(1, 30);
  console.log(result);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.blinks.length === 0 ? (
          <p className="no-result">No Blinks Found</p>
        ) : (
          <>
            {result.blinks.map((blink) => (
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
            ))}
          </>
        )}
      </section>
    </>
  );
}
