import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { TaskStatusTabs } from "../../components/TaskStatusTabs/TaskStatusTabs";
import { TaskCard } from "../../components/Cards/TaskCard";

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      // Map statusSummary data with fixed labels and order
      const statusSummary = response.data?.tasksSummary || {};

      const statusArray = [
        {
          label: "All",
          count: statusSummary.all || 0,
        },
        {
          label: "Pending",
          count: statusSummary.pendingTasks || 0,
        },
        {
          label: "In Progress",
          count: statusSummary.inProgressTasks || 0,
        },
        {
          label: "Completed",
          count: statusSummary.completedTasks || 0,
        },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error while fetching users:", error);
    }
  };

  const handleClick = (taskData) => {
    navigate(`/user/task-details/${taskData._id}`);
  };

  useEffect(() => {
    getAllTasks(filterStatus);

    return () => {};
  }, [filterStatus]);

  const filteredTasks =
    filterStatus === "All"
      ? allTasks
      : allTasks?.filter((task) => task.status === filterStatus);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>
          {tabs?.[0]?.count > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {filteredTasks?.length === 0 ? (
            <div className="col-span-full py-10">
              <p className="text-center text-gray-500">
                No tasks which are
                {filterStatus !== "All" ? ` ${filterStatus}` : " currently assigned"}.
              </p>
            </div>
          ) : (
            filteredTasks.map((item) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map(
                  (user) => user.profileImageUrl
                )}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoChecklist={item.todoChecklist || []}
                onClick={() => handleClick(item)}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
