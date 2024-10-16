import axios from "axios";
import { ChangeEvent, useState } from "react";
import { ImageList } from "./ImageList";

export function UserHome() {
  const token = localStorage.getItem("authToken");

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const user = localStorage.getItem("userName");

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; // Get the files from the event
    if (files && files.length > 0) {
      // Check if files is not null and has at least one file
      const file = files[0]; // Get the first file
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result; // Get the result from FileReader
        if (typeof result === "string") {
          // Check if result is a string
          setImage(result.split(",")[1]); // Remove the prefix and set the base64 string
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.warn("No file selected");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Do not submit if image is null or empty
    if (!image) {
      console.error("Image is required");
      return;
    }

    const payload = {
      title: itemName,
      description: description,
      image: image, // Only string will be sent
    };

    try {
      // Make the POST request to create the task, including the token in the headers
      await axios.post("http://localhost:3000/tasks", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("succesful");

      // You can reset the form or navigate to another page here
      setItemName(""); // Reset item name
      setDescription(""); // Reset description
      setImage(null); // Reset image
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error during task creation:",
          error.response ? error.response.data : error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <>
      <h1>hi {user} welcome to my....</h1>
      <form className="row g-3 needs-validation" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label className="form-label">Item Name</label>
          <input
            type="text"
            className="form-control"
            required
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
        <div className="col-12">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </form>
      <ImageList />
    </>
  );
}
