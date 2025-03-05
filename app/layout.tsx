import "./globals.css";
import SideNav from "@/app/ui/dashboard/sidenav";
import NavBar from "./ui/dashboard/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-[15vw]">
          <SideNav />
        </div>
        <div className="max-h-[100vh h-[100vh] w-full flex-col">
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}
