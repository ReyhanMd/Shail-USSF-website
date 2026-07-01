import { HeroOrchestrator } from "@/components/hero/HeroOrchestrator";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <HeroOrchestrator />
      <div className="h-screen bg-black flex items-center justify-center text-white">
        {/* Placeholder for the rest of the site below the scroll journey */}
        <h2 className="text-2xl text-zinc-500">More Content Below</h2>
      </div>
    </main>
  );
}
