import axios from "axios";
import { useEffect, useState } from "react";
import { Img } from "react-image";
import "../style/imageList.css";
import UpdateTaskModal from "./UpdateTaskModal";

interface Task {
  id: string; // or string, depending on your ID type
  title: string;
  description: string;
  image: string; // Assuming image is stored as a base64 string
}

export function ImageList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const token = localStorage.getItem("authToken");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data); // Set the retrieved tasks to state
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error fetching tasks:",
            error.response?.data || error.message
          );
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    fetchTasks(); // Call the fetch function
  }, [token]); // Dependency array ensures this runs when token changes

  const handleOpenModal = (task: Task) => {
    setSelectedItem(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId)); // Remove deleted task from state
      console.log("Task deleted successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error deleting task:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div
      className="task-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
      }}
    >
      {tasks.map((task) => (
        <div
          className="card"
          key={task.id}
          style={{ width: "100%", textAlign: "center" }}
        >
          {task.image && (
            <Img
              src={`data:image/jpeg;base64,${task.image}`}
              className="card-img-top image-resize" // Apply the class here
              alt={task.title}
              style={{ width: "70%", height: "auto" }} // Adjust the width as needed
            />
          )}
          <div className="card-body">
            <h5 className="card-title">{task.title}</h5>
            <p className="card-text">{task.description}</p>

            <button
              onClick={() => handleOpenModal(task)}
              type="button"
              className="btn btn-primary btn-lg"
            >
              Update
            </button>
            <button
              onClick={() => handleDeleteTask(task.id)} // Call delete function here
              type="button"
              className="btn btn-danger btn-lg"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {isModalOpen && selectedItem && (
        <UpdateTaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          task={selectedItem}
        />
      )}
    </div>
  );
}
