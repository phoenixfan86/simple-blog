import Image from "next/image";
import Header from "./components/Header/Header";
import PostList from "./components/PostList/PostList";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <PostList />
      </main>
    </>

  );
}
