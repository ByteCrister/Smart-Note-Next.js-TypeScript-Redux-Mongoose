"use client";

import { useShowToast } from "@/hooks/useShowToast";
import { GET_API, POST_API } from "@/services/REST-API/API";
import { userSignInType, userSignUpType } from "@/types/client/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type AuthenticateOTPPropTypes = {
    userInfo: userSignUpType | userSignInType | undefined
};

const AuthenticateOTP = ({ userInfo }: AuthenticateOTPPropTypes) => {
    const [otp, setOtp] = useState<string>("");
    const [enteredOtp, setEnteredOtp] = useState<string[]>(Array(6).fill(""));
    const [currOtpBox, setCurrOtpBox] = useState<number>(0);
    const [isOtpExpired, setIsOtpExpired] = useState<boolean>(false);
    const [remainingTime, setRemainingTime] = useState<number>(0);

    const router = useRouter();
    const [effectRender, setEffectRender] = useState<boolean>(false);
    // Refs to track mutable values
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const remainingTimeRef = useRef<number>(180);

    // Start the countdown timer
    const startTimer = () => {
        clearInterval(timerRef.current!); // Clear any previous timer
        timerRef.current = setInterval(() => {
            remainingTimeRef.current -= 1;

            if (remainingTimeRef.current <= 0) {
                clearInterval(timerRef.current!);
                setIsOtpExpired(true);
                useShowToast(
                    "OTP expired. Please request a new one.",
                    "retry-warning",
                    handleGenerateOtp
                );
            } else {
                setRemainingTime(remainingTimeRef.current); // Only update when necessary
            }
        }, 1000);
    };

    const handleGenerateOtp = async () => {
        const URI = `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/user-otp?email=${userInfo?.email}`;
        const responseData = await GET_API(URI);
        setOtp(responseData);
        useShowToast("OTP is sent to your email.", "success");

        // Reset timer
        remainingTimeRef.current = 180;
        setRemainingTime(180);
        setIsOtpExpired(false);
        startTimer();
    };

    useEffect(() => {
        if (!effectRender) {
            if (userInfo?.email) {
                setEffectRender(true);
                handleGenerateOtp();
            }
            // Cleanup on unmount
            return () => {
                if (timerRef.current) clearInterval(timerRef.current);
            };
        }
    }, [userInfo?.email]);

    // * Api function for sign Up
    const signUpApi = async () => {
        try {
            await POST_API(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user/signup`, { ...userInfo });
            useShowToast('Successfully registered.', 'success');
            router.push('/');
        } catch (error: any) {
            console.log(error);
            if (error.response && error.response.data) {
                useShowToast(error.response.data.message || error.message, 'error');
            }
        }
    };

    // * Api function for sign In
    const signInApi = async () => {
        try {
            await POST_API(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user/auth-signin`, { ...userInfo });
            useShowToast('Successfully signed in.', 'success');
            router.push('/');
        } catch (error: any) {
            console.log(error);
            if (error.response && error.response.data) {
                useShowToast(error.response.data.message || error.message, 'error');
            }
        }
    };


    // Handle input change for OTP boxes
    const handleOtpChange = (value: string, index: number) => {
        if (/^\d$/.test(value) && !isOtpExpired) {
            setEnteredOtp((prevOtp) => {
                const newOtp = [...prevOtp];
                newOtp[index] = value;
                return newOtp;
            });

            if (index < 5) setCurrOtpBox(index + 1);
        }
    };


    // Handle backspace for OTP boxes
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !isOtpExpired) {
            e.preventDefault();
            const newOtp = [...enteredOtp];

            if (enteredOtp[index] !== "") {
                newOtp[index] = "";
                setEnteredOtp(newOtp);
            } else if (index > 0) {
                newOtp[index - 1] = "";
                setEnteredOtp(newOtp);
                setCurrOtpBox(index - 1);
            }
        }
    };

    // Render OTP input boxes
    const GetOtpBoxes = () => {
        return (
            <div className="flex gap-2 justify-center">
                {Array.from({ length: 6 }).map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        id={`input-id-${index}`}
                        name={`input-name-${index}`}
                        value={enteredOtp[index]}
                        maxLength={1}
                        autoFocus={currOtpBox === index}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        disabled={isOtpExpired} // Disable input if OTP is expired
                        className="bg-slate-300 font-bold outline-gray-500 text-slate-700 text-xl text-center rounded w-10 h-10"
                    />
                ))}
            </div>
        );
    };

    // OTP verification logic
    const verifyOtp = () => {
        const enteredOptStr = enteredOtp.join("");
        if (enteredOptStr === otp) {
            useShowToast("OTP verified successfully!", "success");
            if (userInfo && "first_name" in userInfo) {
                signUpApi();
            } else {
                signInApi();
            }
        } else {
            useShowToast("OTP is not matched. Please try again.", "retry-warning", handleGenerateOtp);
        }
    };

    // Convert seconds to MM:SS format for the countdown timer
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    return (
        <section className="w-full h-screen flex flex-col gap-3 justify-center items-center">
            <h1 className="text-lg font-semibold text-slate-700 text-center">
                Enter the OTP that has been sent to your Email.
            </h1>
            <GetOtpBoxes />
            <div className="text-center mt-4">
                <p>{formatTime(remainingTime)}</p>
            </div>
            <button
                onClick={() => verifyOtp()}
                disabled={isOtpExpired}
                className="px-2 py-1 bg-slate-600 text-white rounded hover:bg-slate-300 hover:text-slate-950 transition duration-300 ease-in-out"
            >
                Verify OTP
            </button>
        </section>
    );
};

export default AuthenticateOTP;
