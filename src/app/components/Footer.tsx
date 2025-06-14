"use client"

import { usePosts } from "@/hooks/usePosts";

const Footer = () => {
  const posts = usePosts();

  return (
    <footer className="fixed bottom-0 w-full flex justify-between bg px-3 py-1 ring-1 ring-zinc-300 shadow-xl">
      <a href="#">
        <h3 className=" text-sx text-zinc-700 text-shadow-lg">Simple<span className="font-bold">Blog</span>
        </h3>
      </a>
      <div className="">
        <span className="text-xs text-zinc-500">2025</span>
      </div>
      <div className="flex items-center gap-2 text-xs"><span >Всього постів:</span><span>{posts.length}</span></div>
    </footer>
  );
}
export default Footer;