import { useState } from "react"; // Import useState from React
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

export function SignUp() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  // Specify the type of the event parameter
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission

    // Create the payload
    const payload = {
      username,
      password,
    };

    try {
      // Make the POST request to the signup endpoint
      const response = await axios.post(
        "http://localhost:3000/auth/signup",
        payload
      );
      navigate("/SignIn");
      console.log("Success:", response.data);

      // You can also reset the form or redirect the user here
    } catch (error) {
      // Type assertion to specify the error type
      if (axios.isAxiosError(error)) {
        // Handle the Axios error
        console.error(
          "Error during signup:",
          error.response ? error.response.data : error.message
        );
      } else {
        // Handle a non-Axios error
        console.error("Unexpected error:", error);
      }
      // Handle error (e.g., show a message to the user)
    }
  };

  return (
    <>
      <h1>This is signup</h1>
      <form className="row g-3 needs-validation" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label className="form-label">First name</label>
          <input
            type="text"
            className="form-control"
            required
            value={username}
            onChange={(e) => setusername(e.target.value)} // Update state on input change
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Last name</label>
          <input
            type="text"
            className="form-control"
            required
            value={password}
            onChange={(e) => setpassword(e.target.value)} // Update state on input change
          />
        </div>
        <div className="col-12">
          <button className="btn btn-primary" type="submit">
            Sign Up
          </button>
        </div>
      </form>
    </>
  );
}
