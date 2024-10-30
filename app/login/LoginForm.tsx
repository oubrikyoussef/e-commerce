"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineGoogle } from "react-icons/ai";
import Button from "../components/Button";
import StringInput from "../components/input/StringInput";
import { Separator } from "../components/Separator";
const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    signIn("credentials", {
      ...data,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.ok) {
          router.push("/");
          router.refresh();
          toast.success("Logged in successfully");
        } else {
          toast.error(callback?.error || "Ooops! an internal error occured");
        }
      })
      .catch((error) => {
        console.error("Error trying to login", error);
        toast.error("Ooops! an internal error occured");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <>
      <h2 className="text-2xl font-bold">
        Sign in to E<span className="text-base align-middle">-</span>Shop
      </h2>
      <Button
        outline
        onClick={() => {
          signIn("google");
        }}
        label="Continue with Google"
        Icon={AiOutlineGoogle}
      />
      <Separator width={100} />

      <StringInput
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validation={{
          pattern: {
            value: /^\S+@\S+\.\S+$/i,
            message: "Invalid email address",
          },
        }}
      />
      <StringInput
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
        validation={{
          minLength: {
            value: 6,
            message: "Password are at least 6 characters long",
          },
        }}
      />
      <Button
        label={isLoading ? "Loading..." : "Login"}
        onClick={handleSubmit(onSubmit)}
      />
      <p className="text-sm">
        D&apos;ont have an account?{" "}
        <Link href="/register" className="underline">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
