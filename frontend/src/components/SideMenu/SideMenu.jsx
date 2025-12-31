import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../context/userContext";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import CharAvatar from "../CharAvatar/CharAvatar";

export const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      localStorage.clear();
      clearUser();
      navigate("/login");
    } else {
      navigate(route);
    }
  };

  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      const menuWithProfile = SIDE_MENU_DATA.map((item) => {
        if (item.label === "Admin Profile") {
          return { ...item, path: `/admin/profile/${user._id}` };
        }
        return item;
      });
      setSideMenuData(menuWithProfile);
    } else {
      const menuWithProfile = SIDE_MENU_USER_DATA.map((item) => {
        if (item.label === "User Profile") {
          return { ...item, path: `/user/profile/${user._id}` };
        }
        return item;
      });
      setSideMenuData(menuWithProfile);
    }
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          {user?.profileImageUrl ? (
            <img
              src={user?.profileImageUrl || ""}
              alt="Profile Image"
              className="w-20 h-20 bg-slate-400 rounded-full object-cover"
            />
          ) : (
            <CharAvatar
              fullName={user?.name}
              width="w-20"
              height="h-20"
              style="text-xl"
            />
          )}
        </div>

        {user?.role === "admin" && (
          <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>
        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      {sideMenuData.map((item, index) => (
        <button
          key={`menu_${index}`}
          onClick={() => handleClick(item.path)}
          className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 mb-3 cursor-pointer transition-colors ${
            activeMenu === item.label
              ? "text-primary bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-4 border-primary"
              : "text-gray-700 hover:bg-blue-50"
          }`}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};
