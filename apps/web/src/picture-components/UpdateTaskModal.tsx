import axios from "axios";
import React, { useRef, useState, ChangeEvent } from "react";
import "../style/update.css";

interface UpdateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    id: string;
    title: string;
    description: string;
    image: string;
  } | null;
}

const UpdateTaskModal: React.FC<UpdateTaskModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const token = localStorage.getItem("authToken");
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null); // Managing image state

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result.split(",")[1]); // Set base64 string
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.warn("No file selected");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task) {
      console.error("No task provided");
      return;
    }

    // Use the existing image if a new one is not selected
    const updatedImage = image || task.image;

    if (
      !titleRef.current?.value ||
      !descriptionRef.current?.value ||
      !updatedImage
    ) {
      console.error("All fields are required");
      return;
    }

    const payload = {
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      image: updatedImage, // Use either new image or existing one
    };

    try {
      await axios.patch(`http://localhost:3000/tasks/${task.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Task updated successfully");

      onClose();
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  return (
    isOpen &&
    task && (
      <div className="modal">
        <div className="modal-content">
          <h4>Update Task</h4>
          <form onSubmit={handleUpdate}>
            <div className="input-field">
              <input
                id="title"
                ref={titleRef}
                defaultValue={task.title}
                placeholder="Task Title"
                required
              />
              <label htmlFor="title">Title</label>
            </div>
            <div className="input-field">
              <input
                id="description"
                ref={descriptionRef}
                defaultValue={task.description}
                placeholder="Task Description"
                required
              />
              <label htmlFor="description">Description</label>
            </div>

            <div className="col-md-4">
              <label className="form-label">Upload Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <button type="submit" className="btn">
              Update
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default UpdateTaskModal;
