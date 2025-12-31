import React from "react";
import CharAvatar from "../CharAvatar/CharAvatar";

export const AvatarGroup = ({ avatars, maxVisible }) => {
  return (
    <div className="flex items-center">
      {avatars.slice(0, maxVisible).map((avatar, index) => {
        if (avatar.profileImageUrl) {
          return (
            <img
              key={index}
              src={avatar.profileImageUrl}
              alt={avatar.fullName || `Avatar ${index}`}
              className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 object-cover"
            />
          );
        } else {
          return (
            <CharAvatar
              key={index}
              fullName={avatar.name || ""}
              width="w-9"
              height="h-9"
              style="text-sm"
              className="-ml-3 first:ml-0 border-2 border-white"
            />
          );
        }
      })}

      {avatars.length > maxVisible && (
        <div className="w-9 h-9 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
};
