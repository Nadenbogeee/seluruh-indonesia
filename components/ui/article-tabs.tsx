import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export function ArticleTabs() {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">
          <Image
            src="/first.png"
            alt="Menu"
            width={45}
            height={15}
            className="h-[2.5vh] w-[1.5vw]"
          />
          <div className="flex flex-col">
            <p>Article</p>
            <p>List Article</p>
          </div>
        </TabsTrigger>
        <TabsTrigger value="password">
          <Image
            src="/first.png"
            alt="Menu"
            width={45}
            height={15}
            className="h-[2.5vh] w-[1.5vw]"
          />
          <div className="flex flex-col">
            <p>Add / Edit</p>
            <p>Detail Article</p>
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="flex flex-col">{/* search */}</div>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              <p>
                Change your password here. After saving, you'll be logged out.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
