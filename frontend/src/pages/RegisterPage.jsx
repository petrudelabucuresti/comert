import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await register(form);

      localStorage.setItem("token", res.token);

      navigate("/");
    } catch (err) {
      alert("Eroare la înregistrare");
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Register</h1>

      <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2 mt-4" />
      <input name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 mt-4" />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 mt-4" />

      <button onClick={handleSubmit} className="mt-6 w-full bg-black text-white p-2">
        Register
      </button>
    </div>
  );
}