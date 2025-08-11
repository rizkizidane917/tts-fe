import { ReactNode } from "react";
import Navbar from "../Navbar/Navbar";

interface TemplateLayoutProps {
  children: ReactNode;
}

const TemplateLayout = ({ children }: TemplateLayoutProps) => {
  return (
    <div className="w-full h-full">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
};

export default TemplateLayout;
