import { GetServerSideProps } from "next";
import HistoryList from "@/components/page-components/Homepage/HistoryList";
import TextToSpeechForm from "@/components/page-components/Homepage/TextToSpeechForm";
import TemplateLayout from "@/components/Templates/TemplateLayout";

export default function Home() {
  return (
    <TemplateLayout>
      <div className="w-full min-h-screen h-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TextToSpeechForm />
          </div>
          <div className="lg:col-span-1">
            <HistoryList />
          </div>
        </div>
      </div>
    </TemplateLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const jwt = ctx.req.cookies["jwt"];

  if (!jwt) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
