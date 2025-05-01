"use client";
import React, { useState } from "react";
import Input from "./Input";
import Link from "next/link";
import { useRouter } from "next/navigation";

const initialState = {
  name: "",
  email: "",
  password: "",
};

const SignupForm = () => {
  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()


  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = state;

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    // Regular expression pattern for a basic email validation
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!pattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsLoading(true);
      const newUser = {
        name,
        email,
        password,
      };

      const response = await fetch("http://localhost:3000/api/signup", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(newUser),
      });

      if (response?.status === 201) {
        setSuccess("Registration Successful");
        setTimeout(() => {
          router.push("/login", { scroll: false });
        }, 1000);
      } else {
        setError("Error occured while registering");
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  const handleChange = (event) => {
    setError("");
    setState({ ...state, [event.target.name]: event.target.value });
  };

  return (
    <section className="min-h-screen flex items-center justify-center  bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white border-2 border-blue-600 rounded-lg shadow-lg max-w-md w-full mx-auto px-6 py-8 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-blue-600">
          Sign Up
        </h2>

        <Input
          label="Name"
          type="text"
          name="name"
          className="border-2 border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          onChange={handleChange}
          value={state.name}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          className="border-2 border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          onChange={handleChange}
          value={state.email}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          className="border-2 border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          onChange={handleChange}
          value={state.password}
        />

        {error && <div className="text-red-700">{error}</div>}

        {success && <div className="text-green-700">{success}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 font-bold"
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-600 text-lg">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default SignupForm;
