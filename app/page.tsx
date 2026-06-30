import { Header } from "@/components/header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1200px] px-5 md:px-7 lg:px-8">
        <div className="pt-8 md:pt-10">
          <h1 className="font-heading text-2xl font-bold text-ink">All products</h1>
          <p className="mt-1 text-sm font-medium text-muted">194 items</p>
        </div>
      </main>
    </>
  );
}
