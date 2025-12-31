import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUsers } from "react-icons/lu";
import { Modal } from "../Modal/Modal";
import { AvatarGroup } from "../AvatarGroup/AvatarGroup";
import { UserContext } from "../../context/userContext";
import CharAvatar from "../CharAvatar/CharAvatar";

export const SelectUsers = ({
  selectedUsers,
  setSelectedUsers,
  users = [],
}) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  const { user } = useContext(UserContext);

  const getTeamMembers = async () => {
    try {
      const userId = user?._id;
      if (!userId) return;

      const response = await axiosInstance.get(
        API_PATHS.USERS.GET_TEAM_MEMBERS(userId)
      );
      if (response.data?.length > 0) {
        setTeamMembers(response.data);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  // Create array of user objects for AvatarGroup, filtered by selectedUsers
  const selectedUsersData = teamMembers.filter((user) =>
    selectedUsers.includes(user._id)
  );

  useEffect(() => {
    if (isModalOpen) {
      getTeamMembers();
      // Initialize temp selection from selectedUsers on modal open
      setTempSelectedUsers(selectedUsers);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([]);
    }
  }, [selectedUsers]);

  return (
    <>
      <div className="space-y-4 mt-2">
        {selectedUsersData.length === 0 && (
          <button className="card-btn" onClick={() => setIsModalOpen(true)}>
            <LuUsers className="text-sm" /> Add Members
          </button>
        )}

        {selectedUsersData.length > 0 && (
          <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <AvatarGroup avatars={selectedUsersData} maxVisible={3} />
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Select Team Members"
        >
          <div className="space-y-4 h-[60vh] overflow-y-auto">
            {teamMembers.map((user) => (
              <div
                className="flex items-center gap-4 p-3 border-b border-gray-200"
                key={user._id}
              >
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <CharAvatar
                    fullName={user.name}
                    width="w-10"
                    height="h-10"
                    style="text-base"
                  />
                )}

                <div className="flex-1">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-[13px] text-gray-500">{user.email}</p>
                </div>

                <input
                  type="checkbox"
                  checked={tempSelectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button className="card-btn" onClick={() => setIsModalOpen(false)}>
              CANCEL
            </button>
            <button className="card-btn-fill" onClick={handleAssign}>
              DONE
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};
