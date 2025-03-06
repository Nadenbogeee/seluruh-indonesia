import Link from "next/link";
import Image from "next/image";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-[1vw] py-4">
      {/* <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <p>ini logo</p>
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-y-2 md:space-x-0">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="block">Sign Out</div>
          </button>
        </form>
      </div> */}
      <div className="flex h-[14vh] min-w-full items-center justify-center gap-[0.5vw]">
        <Image src="/Logo.png" alt="Company Logo" width={50} height={50} />
        <p className="text-[1vw] font-bold text-[#51b15c]">Logo</p>
      </div>
      <Link
        href="/dashboard"
        className="flex items-center gap-[0.7vw] rounded-tl-[0.2vw] rounded-bl-[0.2vw] border-l-[0.2vw] border-[#51b15c] p-[0.8vw]"
      >
        <Image src="/Article-logo.png" alt="Menu" width={25} height={25} />
        <p className="text-[0.9vw] font-medium text-[#51b15c]">Article</p>
      </Link>
    </div>
  );
}
