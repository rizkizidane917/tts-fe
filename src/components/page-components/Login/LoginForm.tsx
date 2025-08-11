import { setAuthToken } from "@/config/rootAxios";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/router";
import { useState } from "react";

interface LoginResponse {
  message: string;
  user: {
    sub: string;
    email: string;
  };
  access_token: string;
}

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUser } = useAuthStore();

  const mutationLogin = useCustomMutation<LoginResponse>({
    onSuccess: async (data) => {
      setIsLoading(false);

      // simpan token dan user
      if (data?.access_token) {
        setAuthToken(data.access_token); // simpan token ke axios & localStorage
      }
      if (data?.user) {
        setUser(data.user); // simpan ke zustand & localStorage
      }

      router.push("/");
    },
    onError: (err) => {
      setIsLoading(false);
      console.error(err);
    },
  });

  const handleLogin = () => {
    mutationLogin.mutate({
      path: "/auth/login",
      method: "post",
      payload: {
        email: "zidane917@gmail.com",
        password: "testing123",
      },
    });
  };
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <div className="text-center mb-8 flex flex-col gap-4">
        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-7 text-indigo-600"
          >
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
            <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">ISpeak</h2>
        <p className="text-gray-600 text-lg">
          Advanced Text-to-Speech Platform
        </p>
      </div>

      <div className="flex items-center flex-col gap-6">
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-500"
            placeholder="Enter your email"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-500"
            placeholder="Enter your password"
          />
        </div>
        <button
          onClick={handleLogin}
          type="button"
          // type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
