import { useState } from "react"
import { useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/router"

import * as accountService from "services/account.service"
import { USERNAME_PATTERN } from "constants/regex"
import { validateNotWhitespaceOnly } from "utils"

import Input from "components/Shared/Input/Input"
import Button from "components/Shared/Button/Button"
import Icon from "components/Shared/Icon/Icon"

import Logo from "public/logo.png"

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { register, handleSubmit, formState: { isValidating } } = useForm()

  const onSubmit = async (values) => {
    if (isValidating) return    
    setIsLoading(true)

    const res = await accountService.loginUser(values)

    if (res.success) {
      localStorage.setItem("token", res.token)
      toast.success("Login was successful!")
      setInterval(() => router.push("/"), 2000)
    } else {
      const errorMessage = res.error?.response?.data?.message
      if (errorMessage) toast.error(errorMessage)
      else toast.error("There is a problem on the server side")
    }
  }

  return (
    <>
      <div className="w-full grid place-items-center py-8">
        <div className="w-80">
          <header className="grid place-items-center">
            <div className="bg-[#151515] p-5 rounded-full w-20 h-20 mb-6">
              <img src={Logo.src} alt="logo" className="w-full h-full select-none" />
            </div>
            <h1 className="text-2xl mb-6 font-medium text-gray-600">Sign in to Knaban</h1>
          </header>
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <Input
              name="username"
              className="mb-3"
              placeholder="Enter your username"
              register={register("username", { required: true, pattern: USERNAME_PATTERN })}
              icon={
                <Icon
                  name="user"
                  size={20}
                  color="gray"
                  className="absolute transform -translate-y-1/2 top-1/2 left-3"
                />
              }
            />
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              className="mb-5"
              register={register("password", { required: true, minLength: 8, validate: validateNotWhitespaceOnly })}
              icon={
                <Icon
                  name="lock"
                  size={20}
                  color="gray"
                  className="absolute transform -translate-y-1/2 top-1/2 left-3"
                />
              }
            />
            <Button variant="primary" className="mb-4" type="submit" loading={isLoading}>
              Sign in
            </Button>
            <p className="text-[15px] text-center text-gray-600 mb-3">Don't have a Kanban account?</p>
            <Button variant="outline-primary" href="/signup">
              Create new account
            </Button>
          </form>
        </div>
      </div>

      <Toaster position="top-right" />
    </>
  )
}

export default LoginForm
