import Image from "next/image";
import HeroSearch from "./components/HeroSearch";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="relative w-full h-[50dvh] bg-white dark:bg-black">
        {/* Hero Image */}
        <Image
          src="/hero.jpg"          // put the image in /public
          alt="Hero image"
          fill                     // fill the parent container
          className="object-cover" // cover the container without stretching
          priority                 // load faster
        />

        {/* Overlay text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg sm:text-5xl">
            Welcome to FindMeParking
          </h1>
          <p className="mt-4 text-lg text-white drop-shadow-md sm:text-xl">
            Find parking near you effortlessly
          </p>
        </div>
      </main>

      <section className="bg-indigo-900 dark:bg-black py-12">
        <HeroSearch />
      </section>
    </div>
  );
}
