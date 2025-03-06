"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const NavBar = () => {
  const [position, setPosition] = React.useState("English");

  return (
    <>
      <div className="flex h-[7vh] max-h-[7vh] justify-between px-[1vw] py-[2vh]">
        <h1 className="text-[1vw] font-medium">Article</h1>
        <div className="flex w-[50vw] items-center justify-end gap-[1vw]">
          {/* dropdown language */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Image
                  src="/uk.png"
                  alt="Menu"
                  width={45}
                  height={15}
                  className="h-[2vh] w-[1.5vw]"
                />
                {/* arrow */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Languages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={position}
                onValueChange={setPosition}
              >
                <DropdownMenuRadioItem value="English">English</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Indonesia">
                  Indonesia
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* notification */}
          <Image
            src="/notification.png"
            alt="Menu"
            width={45}
            height={15}
            className="h-[2.5vh] w-[1.5vw]"
          />
          <div className="min-h-full border border-[#c4c4c4]"></div>
          {/* user profile */}
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </>
  );
};

export default NavBar;
