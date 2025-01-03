import DashboardPage from "./biometricDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biometric Dashboard",
  description: "Biometric Dashboard Page",
};

function Page() {

  return (
    <DashboardPage />
  );

}

export default Page;