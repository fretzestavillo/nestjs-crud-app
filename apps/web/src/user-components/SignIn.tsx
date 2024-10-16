import { useState } from "react"; // Import useState from React
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

export function SignIn() {
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
        "http://localhost:3000/auth/signin",
        payload
      );

      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("authToken", response.data.accessToken);
      localStorage.setItem("userName", response.data.myname);

      navigate("/UserHome");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error during signin:",
          error.response ? error.response.data : error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <>
      <h1>This is signin</h1>
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
            Sign In
          </button>
        </div>
      </form>
    </>
  );
}
