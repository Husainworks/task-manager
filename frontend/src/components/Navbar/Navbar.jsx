import React, { useState, useContext } from "react";
import { SideMenu } from "../SideMenu/SideMenu";
import { HiOutlineX, HiOutlineMenu } from "react-icons/hi";
import { Link } from "react-router";
import { UserContext } from "../../context/userContext";

export const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { user } = useContext(UserContext);

  const getRedirectPath = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "member") return "/user/dashboard";
    return "/login";
  };

  return (
    <>
      <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
        <button
          className="block max-[1079px]:block min-[1080px]:hidden text-black"
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>

        <Link to={getRedirectPath()}>
          <h2 className="text-lg font-medium text-black">Task Manager</h2>
        </Link>

        <div
          className={`fixed top-[61px] left-0 z-40 transition-transform duration-300 ease-linear ${
            openSideMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SideMenu activeMenu={activeMenu} />
        </div>
      </div>
    </>
  );
};
