import { Axios } from "@/config/rootAxios";
import { useAuthStore } from "@/store/useAuthStore";
import useModalStore from "@/store/useModalStore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Modal from "../shared/Modal/Modal";

const Navbar = () => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { openModal, closeModal } = useModalStore();

  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.email) setEmail(parsed.email);
      } catch (err) {
        console.error("Error parsing stored user", err);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await Axios.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      logout();
      closeModal();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  const username = email.split("@")[0];
  const formatted = username.charAt(0).toUpperCase() + username.slice(1);

  return (
    <header id="header" className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 text-indigo-600"
            >
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
              <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">ISpeak</h1>
        </div>

        <div className="flex items-center space-x-4">
          <h2 className="text-lg text-indigo-600 font-semibold">
            Hi, {formatted}
          </h2>
          <button
            onClick={() => openModal("logout")}
            id="logout"
            className="cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 rotate-180 font-semibold text-gray-600 hover:text-gray-900"
            >
              <path
                fillRule="evenodd"
                d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <Modal id="logout">
        <div className="text-center mb-6">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="text-red-600 text-2xl" data-fa-i2svg="">
              <svg
                className="size-5"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="right-from-bracket"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                ></path>
              </svg>
            </i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Confirm Logout
          </h3>
          <p className="text-gray-600">
            Are you sure you want to sign out of your account?
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={closeModal}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => handleLogout()}
            id="confirm-logout"
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </Modal>
    </header>
  );
};

export default Navbar;
