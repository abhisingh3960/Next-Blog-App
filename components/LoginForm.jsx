"use client";
import React, { useState } from "react";
import Input from "./Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const initialState = {
  name: "",
  email: "",
  password: "",
};

const LoginForm = () => {
  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleChange = (event) => {
    setError("");
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = state;

    if (!email || !password) {
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

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid Credentials");
        setIsLoading(false);
        return;
      }

      router.push("/blog");
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-blue-600 rounded-xl shadow-lg w-full max-w-md px-6 py-8 space-y-6"
      >
        <h2 className="text-center text-3xl font-bold text-blue-600">Login</h2>

        <Input
          label="Email"
          type="text"
          name="email"
          onChange={handleChange}
          value={state.email}
          className="border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          onChange={handleChange}
          value={state.password}
          className="border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
        />

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>

        <p className="text-center text-gray-600 text-lg">
          Need an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </section>
  );
};

export default LoginForm;
