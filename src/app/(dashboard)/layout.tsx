import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen flex">
            {/* Left */}
            <div className="min-w-20 w-[14%] md:w-[8%] lg:w-[20%] xl:w-[16%] p-1 sm:p-4 max-h-screen overflow-y-scroll">
                <Link className="flex items-center justify-center lg:justify-start" href="/">
                    <Image className="lg:hidden" src="/logo.png" width={50} height={50} alt="logo" />
                    <Image className="hidden lg:inline-block" src="/logo-typo.png" width={150} height={50} alt="logo" />
                </Link>
                <Menu />
            </div>
            {/* Right */}
            <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-y-scroll flex flex-col">
                <Navbar />
                {children}
            </div>
        </div>
    );
}
