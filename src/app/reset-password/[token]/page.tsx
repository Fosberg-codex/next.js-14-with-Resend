"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ResetPassword = ({params}:any) => {

console.log(params.token)
  const router = useRouter();
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState<any>(null);
  // const session = useSession();
  const { data: session, status: sessionStatus } = useSession();

useEffect(() => {
  const verifyToken = async () => {
    try {
      const res = await fetch("/api/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: params.token,
        }),
      });
      if (res.status === 400) {
        setError("invalid token or has expired");
        setVerified(true);
      }
      if (res.status === 200) {
        setError("");
        setVerified(true);
        const userData = await res.json();
        setUser(userData);
      }
    } catch (error) {
      setError("Error, try again");
      console.log(error);
    }
  };
  verifyToken();
}, [params.token]);



  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);



  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const password = e.target[0].value;

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          email: user?.email
        }),
      });
      if (res.status === 400) {
        setError("something went wrong please try again");
      }
      if (res.status === 200) {
        setError("");
        router.push("/login");
      }
    } catch (error) {
      setError("Error, try again");
      console.log(error);
    }

  };

  



  if (sessionStatus === "loading" || !verified) {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="bg-[#212121] p-8 rounded shadow-md w-96">
          <h1 className="text-4xl text-center font-semibold mb-8">Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-4000 focus:text-black"
              placeholder="password"
              required
            />
            
            <button
              type="submit"
              disabled={error.length > 0}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {" "}
              Reset password
            </button>
            <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
          </form>
        
        </div>
      </div>
    )
  );
};

export default ResetPassword;
