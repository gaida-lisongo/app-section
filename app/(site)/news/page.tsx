import { Metadata } from "next";
import NewsClient from "./NewsClient";

export const metadata: Metadata = {
  title: "Section Académique",
  description: "Institut de formation académique et professionnelle",
  keywords: ["institut", "formation", "académique", "éducation"],
  openGraph: {
    title: "Institut | Section Académique",
    description: "Institut de formation académique et professionnelle",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Institut | Section Académique",
    description: "Institut de formation académique et professionnelle",
  },
};
const SingleBlogPage = () => {
  return <NewsClient />;
};

export default SingleBlogPage;
