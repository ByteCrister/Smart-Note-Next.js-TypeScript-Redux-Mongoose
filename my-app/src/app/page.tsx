import Home from "@/components/home/Home";
import { Metadata } from "next";
import Head from "next/head";

export async function generateMetadata(): Promise<Metadata> {
  const tags = await fetchTagsFromAPI();

  return {
    title: "Smart Note - Organize Your Notes Efficiently",
    description: "Smart Note helps you organize, store, and manage your notes seamlessly. Create, share, and keep track of your ideas with ease.",
    keywords: tags.join(", "),
    openGraph: {
      title: "Smart Note - Organize Your Notes Efficiently",
      description: "Smart Note helps you organize, store, and manage your notes seamlessly.",
      url: process.env.NEXT_PUBLIC_DOMAIN,
      type: "website",
      images: [
        {
          url: "https://www.smartnote.com/assets/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Smart Note Logo",
        }
      ],
      locale: "en_US",
    },
    robots: "index, follow",
  };
}

async function fetchTagsFromAPI(): Promise<string[]> {
  return ["note-taking", "productivity", "organize notes", "smart note app", "personal notes"];
}

const HomePage = () => {
  return (
    <>
      <Head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_DOMAIN} />
      </Head>

      <Home />
    </>
  );
};

export default HomePage;