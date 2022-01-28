import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { publicAgent } from "../lib/network";
import useStore from "../store/store";

const SignupPage = (props) => {
  const router = useRouter();
  const {isLoggedIn, setIsLoggedIn, setToken, isLoading, setIsLoading} = useStore();
  const [state, setState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    error: null,
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // validation
    if (!state.email || !state.password) {
      setState({ ...state, error: "All fields are required" });
    } else if (state.password && state.password !== state.confirmPassword) {
      setState({ ...state, error: "Passwords did not match" });
    } else {
      // signup
      setState({ ...state, error: null });
      publicAgent
        .post("/user", { email: state.email, password: state.password })
        .then((res) => {
          const token = res.data?.token
          // save token
          setToken(token)
          setIsLoggedIn(true)
          router.push("/");
        })
        .catch((err) => {
          console.log(err);
          setState({
            ...state,
            error:
              "Something went wrong while signing you up. Please try again later!",
          });
        });
    }
  };
  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <form
          onSubmit={onSubmit}
          className="flex flex-col items-center justify-around h-96 w-96 p-4 px-8 border rounded-xl"
        >
          <h3 className="text-3xl text-gray-600">Login</h3>
          <div className="w-full">
            <div className="w-full flex flex-col">
              <label className="self-start" htmlFor="email">
                Email
              </label>
              <input
                className="border rounded-lg p-3"
                name="email"
                onChange={onChange}
                value={state.email}
              />
            </div>
            <div className="w-full flex flex-col">
              <label className="" htmlFor="password">
                Password
              </label>
              <input
                className="border rounded-lg p-3"
                name="password"
                type="password"
                onChange={onChange}
                value={state.password}
              />
            </div>
            <div className="w-full flex flex-col">
              <label className="" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="border rounded-lg p-3"
                name="confirmPassword"
                type="password"
                onChange={onChange}
                value={state.confirmPassword}
              />
            </div>
          </div>
          {state.error && <text className="text-red-500">{state.error}</text>}
          <button
            type="submit"
            className="border rounded-lg bg-teal-500 text-white px-4 py-2 w-full"
          >
            Sign Up
          </button>
          <p>
            <Link href="/login">
              <a href="/login" className="hover:text-teal-500">
                Already have an account? Login
              </a>
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default SignupPage;
