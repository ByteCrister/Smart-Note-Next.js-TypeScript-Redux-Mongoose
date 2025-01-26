"use client";

import { signUpValidation } from "@/services/helper/validation";
import { Dispatch, JSX, SetStateAction, useState } from "react";
import { useFormik } from 'formik';
import { POST_API } from "@/services/REST-API/API";
import { useShowToast } from "@/hooks/useShowToast";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { Open_Sans } from "next/font/google";
import { userSignInType, userSignUpType } from "@/types/client/types";

const openSans = Open_Sans({
    weight: '400',
    subsets: ['latin'],
});

// Typing for props
type SignUpProps = {
    setPageState: Dispatch<SetStateAction<number>>;
    setUserInfo: Dispatch<SetStateAction<userSignUpType | userSignInType | undefined>>;
};
const SignUp = ({ setPageState, setUserInfo }: SignUpProps) => {
    const [isPasswordShow, setIsPasswordShow] = useState<boolean>(false);
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: ''
        },
        validationSchema: signUpValidation,
        onSubmit: async (values) => {
            try {
                setIsButtonLoading(true);
                const URI = `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/auth-signup`;
                const data = { ...values };
                await POST_API(URI, data);
                setPageState(1);
                setUserInfo({ ...values })
            } catch (error: any) {
                console.log(error);
                if (error.response && error.response.data) {
                    useShowToast(error.response.data.message || error.message, 'error');
                }
            } finally {
                setIsButtonLoading(false);
            }
        },
    });

    const getValidationString = (field: keyof typeof formik.initialValues): JSX.Element => {
        return formik.touched[field] && formik.errors[field] ? (
            <span className="text-red-500 font-semibold text-sm">
                <sup>*</sup>{formik.errors[field]}
            </span>
        ) : (
            <label htmlFor={field} className="text-slate-500 font-medium text-sm">
                <b className="capitalize">
                    <sup>*</sup>{field.replace('_', " ")}
                </b>
            </label>
        );
    };

    return (
        <form onSubmit={formik.handleSubmit} className={`flex flex-col items-center gap-2 w-full`}>
            <section className="flex md:justify-between md:flex-row flex-col gap-2 w-full">
                <div>
                    {getValidationString('first_name')}
                    <br />
                    <input
                        type='text'
                        name="first_name"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.first_name}
                        placeholder='first name'
                        className={`w-full bg-white rounded px-2 py-1 outline-none ${openSans.className} font-bold text-slate-500`}
                    ></input>
                </div>
                <div>
                    {getValidationString('last_name')}
                    <br />
                    <input
                        type='text'
                        name="last_name"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.last_name}
                        placeholder='last name'
                        className={`w-full bg-white rounded px-2 py-1 outline-none ${openSans.className} font-bold text-slate-500`}
                    ></input>
                </div>
            </section>
            <div className="w-full">
                {getValidationString('email')}
                <br />
                <input
                    type='email'
                    name="email"
                    required
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    placeholder='email'
                    className={`w-full bg-white rounded px-2 py-1 outline-none ${openSans.className} font-bold text-slate-500`}
                ></input>
            </div>
            <section className="w-full">
                {getValidationString('password')}
                <br />
                <div className={`flex justify-between bg-white rounded px-2 py-1 outline-none ${openSans.className} font-bold text-slate-500`}>
                    <input
                        type={isPasswordShow ? 'text' : 'password'}
                        name="password"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='password'
                        value={formik.values.password}
                        className={`w-full bg-white outline-none ${openSans.className} font-bold text-slate-500`} />
                    <button type="button" onClick={(e) => { e.preventDefault(); setIsPasswordShow(prev => !prev); }}>
                        {isPasswordShow ? <IoEyeSharp className="text-slate-500" /> : <IoEyeOffSharp className="text-slate-500" />}
                    </button>
                </div>
            </section>
            <button type='submit' className='w-full bg-slate-500 px-2 py-1 font-semibold rounded text-gray-100 hover:bg-slate-300 hover:text-slate-600 transition duration-300 ease-in-out'>
                {isButtonLoading ? <span className='loading loading-spinner loading-xs '></span> : <span>Sign Up</span>}
            </button>
        </form>
    )
};

export default SignUp;