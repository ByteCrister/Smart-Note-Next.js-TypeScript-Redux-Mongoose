"use client";

import { signInValidation } from "@/services/helper/common/validation";
import { JSX, useState } from "react";
import { useFormik } from 'formik';
import { POST_API } from "@/services/helper/REST-API/API";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { Open_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import Toaster from "@/services/common/Toaster";

const openSans = Open_Sans({
  weight: '400',
  subsets: ['latin'],
});

const SignIn = () => {
  const router = useRouter();
  const [isPasswordShow, setIsPasswordShow] = useState<boolean>(false);
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: signInValidation,
    onSubmit: async (values) => {
      try {
        setIsButtonLoading(true);
        const URI = `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/signin`;
        const data = { ...values };
        await POST_API(URI, data);
        Toaster("Successfully signed in.", "success");
        router.push("/");
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
    <form onSubmit={formik.handleSubmit} className="flex flex-col items-center gap-2 w-full">
      <div className="w-full">
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
      <section className="w-full">
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
            placeholder='password'
            value={formik.values.password}
            className={`w-full bg-white outline-none ${openSans.className} font-bold text-slate-500`} />
          <button type="button" onClick={(e) => { e.preventDefault(); setIsPasswordShow(prev => !prev); }}>
            {isPasswordShow ? <IoEyeSharp className="text-slate-500" /> : <IoEyeOffSharp className="text-slate-500" />}
          </button>
        </div>
      </section>
      <button type='submit' className='w-full bg-slate-500 px-2 py-1 font-semibold rounded text-gray-100 hover:bg-slate-300 hover:text-slate-600 transition duration-300 ease-in-out'>
        {isButtonLoading ? <span className='loading loading-spinner loading-xs '></span> : <span>Sign In</span>}
      </button>
    </form>
  )
}

export default SignIn;