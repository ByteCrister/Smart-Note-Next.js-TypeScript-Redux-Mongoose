"use client";

import { Dispatch, JSX, SetStateAction, useState } from "react";
import { useFormik } from 'formik';
import { POST_API } from "@/services/helper/REST-API/API";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { Open_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { forgotPassEmailValidation, forgotPassPasswordValidation } from "@/services/helper/common/validation";
import { userSignInType, userSignUpType } from "@/types/client/types";
import Toaster from "@/services/common/Toaster";

const openSans = Open_Sans({
  weight: '400',
  subsets: ['latin'],
});

// Prop Types
type ForgotPasswordPropTypes = {
  setPageState: Dispatch<SetStateAction<number>>;
  setUserInfo: Dispatch<SetStateAction<userSignUpType | userSignInType | undefined>>;
  isEmailChecked: boolean;
  userInfo: userSignUpType | userSignInType | undefined
};

const ForgotPassword = ({ setPageState, setUserInfo, userInfo, isEmailChecked }: ForgotPasswordPropTypes) => {
  const router = useRouter();
  const [isPasswordShow, setIsPasswordShow] = useState<boolean>(false);
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      [isEmailChecked ? "password" : "email"]: ""
    },
    validationSchema: isEmailChecked ? forgotPassPasswordValidation : forgotPassEmailValidation,
    onSubmit: async (values) => {
      try {
        setIsButtonLoading(true);

        if (isEmailChecked) {
          const data: { email: string | undefined; password: string; } = { email: userInfo?.email, password: values.password };
          forgotPasswordApi(data);
        } else {
          const URI = `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/auth-forgot-password`;
          const data = { ...values };

          const updatedUserInfo: userSignInType = {
            email: values.email,
            password: userInfo?.password || "",
          };

          await POST_API(URI, data);
          setUserInfo(updatedUserInfo);
          setPageState(1);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);

          const serverError = (error as { response?: { data?: { message: string } } }).response?.data;
          Toaster(serverError?.message || error.message, 'error');
        }
      } finally {
        setIsButtonLoading(false);
      }
    },
  });

  // * Api function for sign In
  const forgotPasswordApi = async (data: { email?: string, password: string }) => {
    try {
      await POST_API(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user/forgot-password`, data);
      Toaster('Password Updated successfully.', 'success');
      router.push('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);

        const serverError = (error as { response?: { data?: { message: string } } }).response?.data;
        Toaster(serverError?.message || error.message, 'error');
      }
    };
  };

  const getValidationString = (field: keyof typeof formik.initialValues): JSX.Element => {
    return formik.touched[field] && formik.errors[field] ? (
      <span className="text-red-500 font-semibold text-sm">
        <sup>*</sup>{formik.errors[field]}
      </span>
    ) : (
      <label htmlFor={field + ""} className="text-slate-500 font-medium text-sm">
        <b className="capitalize">
          <sup>*</sup>{field}
        </b>
      </label>
    );
  };

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col items-center gap-2 w-full">
      {
        isEmailChecked ? <section className="w-full">
          {getValidationString('password')}
          <br />
          <div className={`flex justify-between bg-white rounded px-2 py-1 outline-none ${openSans.className} font-bold text-slate-500`}>
            <input
              type={isPasswordShow ? 'text' : 'password'}
              name="password"
              id="password"
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder='new password'
              value={formik.values.password}
              className={`w-full bg-white outline-none ${openSans.className} font-bold text-slate-500`} />
            <button type="button" onClick={(e) => { e.preventDefault(); setIsPasswordShow(prev => !prev); }}>
              {isPasswordShow ? <IoEyeSharp className="text-slate-500" /> : <IoEyeOffSharp className="text-slate-500" />}
            </button>
          </div>
        </section>
          : <div className="w-full">
            {getValidationString('email')}
            <br />
            <input
              type='email'
              name="email"
              id="email"
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder='email'
              className={`w-full bg-white rounded px-2 py-1 outline-none ${openSans.className} font-bold text-slate-500`}
            ></input>
          </div>
      }


      <button type='submit' className='w-full bg-slate-500 px-2 py-1 font-semibold rounded text-gray-100 hover:bg-slate-300 hover:text-slate-600 transition duration-300 ease-in-out'>
        {isButtonLoading ? <span className='loading loading-spinner loading-xs '></span> : <span>{isEmailChecked ? "Submit New Password" : "Submit Email"}</span>}
      </button>
    </form>
  )
};
export default ForgotPassword;