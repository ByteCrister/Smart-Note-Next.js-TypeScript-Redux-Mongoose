"use client";

import { JSX, useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import AuthenticateOTP from "./AuthenticateOTP";
import { userSignInType, userSignUpType } from "@/types/client/types";

// Styling for buttons to indicate active state
const buttonStyle = " font-semibold px-4 py-2 rounded-2xl md:rounded-full transition-all duration-300";

const DefaultAuthPage = () => {
    const [pageState, setPageState] = useState<number>(0);
    const [currentAuthPage, setCurrentAuthPage] = useState<0 | 1 | 2>(0);
    const [userInfo, setUserInfo] = useState<userSignUpType | userSignInType>();

    const handleButtonClick = (page: 0 | 1 | 2) => {
        setCurrentAuthPage(page);
    };

    const getCurrentPage = (): JSX.Element => {
        switch (currentAuthPage) {
            case 1:
                return <SignUp setPageState={setPageState} setUserInfo={setUserInfo} />;
            case 2:
                return <ForgotPassword />;
            default:
                return <SignIn />;
        }
    };

    const getButtons: () => JSX.Element = () => {
        return (
            <div className="flex justify-center space-x-4 mb-4">
                <button
                    className={`${buttonStyle} ${currentAuthPage === 1 ? "bg-slate-400 text-white" : "bg-zinc-200 text-slate-400"}`}
                    onClick={() => handleButtonClick(1)}
                >
                    Sign Up
                </button>
                <button
                    className={`${buttonStyle} ${currentAuthPage === 0 ? "bg-slate-400 text-white" : "bg-zinc-200 text-slate-400"}`}
                    onClick={() => handleButtonClick(0)}
                >
                    Sign In
                </button>
                <button
                    className={`${buttonStyle} ${currentAuthPage === 2 ? "bg-slate-400 text-white" : "bg-zinc-200 text-slate-400"}`}
                    onClick={() => handleButtonClick(2)}
                >
                    Forgot Password
                </button>
            </div>
        )
    };

    return (
        pageState === 0 ?
            // * Main container
            <div className="flex justify-center items-center h-screen">
                <section className="w-full max-w-md backdrop-blur-3xl p-8 rounded-xl shadow-xl bg-transparent">
                    {/* Button section */}
                    {getButtons()}

                    {/* Transition section for dynamic content */}
                    <div className="transition-all duration-500 ease-in-out">
                        {getCurrentPage()}
                    </div>
                </section>
            </div>
            // * after authenticating email an otp will be send on that email
            : <AuthenticateOTP userInfo={userInfo} />
    );
};

export default DefaultAuthPage;
