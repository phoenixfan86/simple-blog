import AddPost from "./AddPost";
import UserAuth from "./UserAuth";

const Header = () => {
  return (
    <header className="relative w-full min-h-18 flex items-center justify-between  px-7 bg shadow-xl">
      <div className="flex items-center gap-1">
        <a href="#">
          <h3 className=" text-xl text-zinc-700 text-shadow-lg">Simple<span className="font-bold">Blog</span>
          </h3>
        </a>

      </div>
      <div className="flex gap-2 items-center">
        <span className="material-symbols-outlined">
          post_add
        </span><AddPost />
      </div>

      <div className=""><UserAuth /></div>
    </header>
  );
}
export default Header;