import React, { useState } from "react";
import bg from "./bg.jpg";

function DonorRegistration() {
  const [donor, setDonor] = useState({
    fullName: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    phone: "",
    email: "",
    nic: "",
    address: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setDonor({ ...donor, [e.target.name]: e.target.value });
  };

  const registerDonor = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/public/donors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(donor)
      });

      const data = await res.text();
      setMessage(data);
    } catch (err) {
      setMessage("Error submitting form");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Donor Registration</h2>

        <div style={styles.row}>
          <input name="fullName" placeholder="Full Name" onChange={handleChange} style={styles.input} />
          <input name="nic" placeholder="NIC" onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.row}>
          <input type="date" name="dob" onChange={handleChange} style={styles.input} />
          <select name="gender" onChange={handleChange} style={styles.input}>
            <option value="">Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div style={styles.row}>
          <select name="bloodGroup" onChange={handleChange} style={styles.input}>
            <option value="">Blood Group</option>
            <option value="A_POSITIVE">A+</option>
            <option value="A_NEGATIVE">A-</option>
            <option value="B_POSITIVE">B+</option>
            <option value="B_NEGATIVE">B-</option>
            <option value="AB_POSITIVE">AB+</option>
            <option value="AB_NEGATIVE">AB-</option>
            <option value="O_POSITIVE">O+</option>
            <option value="O_NEGATIVE">O-</option>
          </select>

          <input name="phone" placeholder="Phone Number" onChange={handleChange} style={styles.input} />
        </div>

        <input name="email" placeholder="Email" onChange={handleChange} style={styles.fullInput} />
        <input name="address" placeholder="Address" onChange={handleChange} style={styles.fullInput} />

        <button onClick={registerDonor} style={styles.button}>
          Register Donor
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    // SAME BACKGROUND
    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  },

  card: {
    background: "rgba(255,255,255,0.9)",
    padding: "30px",
    borderRadius: "12px",
    width: "500px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#b71c1c"
  },

  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  fullInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
  },

  message: {
    marginTop: "15px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#333"
  }
};

export default DonorRegistration;