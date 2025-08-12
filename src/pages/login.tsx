import LoginForm from "@/components/page-components/Login/LoginForm";
import { GetServerSideProps } from "next";

const LoginPage = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4 z-50">
      <LoginForm />
    </div>
  );
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const jwt = ctx.req.cookies["jwt"];

  if (jwt) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
