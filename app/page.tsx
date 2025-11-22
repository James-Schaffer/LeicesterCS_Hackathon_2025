import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="relative w-full h-[50dvh] bg-white dark:bg-black">
        <Image
          src="/hero.jpg"        // put the image in /public
          alt="Hero image"
          fill                   // makes image fill parent container
          className="object-cover" // cover the container without stretching
          priority               // loads faster for hero
        />
      </main>
    </div>
  );
}
