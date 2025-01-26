import DefaultAuthPage from "@/components/auth/DefaultAuthPage";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    // Simulate fetching tags from an API
    const tags = await fetchTagsFromAPI();

    return {
        title: "Sign Up - Smart Note",
        description: "Create an account with Smart Note and organize your notes effortlessly.",
        openGraph: {
            title: "Sign Up - Smart Note",
            description: "Create an account with Smart Note and organize your notes effortlessly.",
            type: "website",
        },
        keywords: tags.join(", "), // Dynamic keywords
    };
}

async function fetchTagsFromAPI(): Promise<string[]> {
    // Example API call
    return ["sign up", "Sign in", "Forgot Password", "smart note", "organize notes", "dynamic tags"];
}

const Page = () => {
    return <DefaultAuthPage />
};

export default Page;
