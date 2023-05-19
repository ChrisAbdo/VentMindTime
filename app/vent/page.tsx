"use client";
import { AnimatePresence, motion } from "framer-motion";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useToast } from "@/components/ui/use-toast";
import { BookOpen, ChevronDown, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/vent/navbar";
import { Textarea } from "@/components/ui/textarea";

interface TextItem {
  text: string;
  id: number;
  size: number; // Add this line
  createdTime: string; // changed from Date to string
}

export default function Home() {
  let { toast } = useToast();

  let [isOpen, setIsOpen] = React.useState<boolean>(false);
  let [inputText, setInputText] = React.useState<string>("");
  let [savedTexts, setSavedTexts] = React.useState<TextItem[]>([]);
  let [remainingSpace, setRemainingSpace] = React.useState<number>(0);
  let [remainingStoragePercentage, setRemainingStoragePercentage] =
    React.useState<number>(100);
  const variants = {
    open: { height: "auto" },
    collapsed: { height: "2rem" }, // Adjust this to match the initial height of your list items
  };
  React.useEffect(() => {
    let storedTexts = localStorage.getItem("texts");

    if (storedTexts) {
      setSavedTexts(JSON.parse(storedTexts));
    }
    logRemainingLocalStorageSpace();
  }, []);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setInputText(event.target.value);
  }

  async function saveToLocalStorage(event: React.SyntheticEvent) {
    if (inputText === "") return;

    let size = new Blob([inputText], { type: "text/plain" }).size;

    const newTexts: TextItem[] = [
      ...savedTexts,
      {
        text: inputText,
        id: new Date().getTime(),
        createdTime: formatCurrentTime(),
        size,
      },
    ];
    localStorage.setItem("texts", JSON.stringify(newTexts));
    setSavedTexts(newTexts);
    setInputText("");

    toast({
      title: "Success!",
      description: "Your bookmark has been saved.",
    });

    logRemainingLocalStorageSpace();
  }

  function formatCurrentTime() {
    const date = new Date();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // months are zero indexed
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  }

  function deleteTextItem(id: number) {
    let filteredTexts = savedTexts.filter((textItem) => textItem.id !== id);
    localStorage.setItem("texts", JSON.stringify(filteredTexts));
    setSavedTexts(filteredTexts);

    toast({
      title: "Attention!",
      description: "Your bookmark has been deleted.",
    });

    logRemainingLocalStorageSpace();
  }

  function logRemainingLocalStorageSpace() {
    let totalStorage = 5 * 1024 * 1024;
    let usedStorage = 0;

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        let item = localStorage.getItem(key);
        if (item) {
          usedStorage += item.length * 2;
        }
      }
    }

    let remainingStorage = totalStorage - usedStorage;
    console.log(`Remaining local storage space: ${remainingStorage} bytes`);
    setRemainingSpace(remainingStorage);

    let percentage = (remainingStorage / totalStorage) * 100;
    setRemainingStoragePercentage(percentage);
  }

  return (
    <div className="bg-black h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>What&apos;s on your mind?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between space-x-12">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>

              <Input type="email" placeholder="Email" />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-6">
                  <span className="sr-only">Add a Thought</span>
                  <span className="text-white">Add a Thought</span>
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-white">
                    What&apos;s on your mind?
                  </DialogTitle>
                </DialogHeader>
                <Textarea
                  placeholder="This can be anything on your mind. A link to a website, an image, or just plain text."
                  className="text-white"
                  value={inputText}
                  //   @ts-ignore
                  onChange={handleInputChange}
                  //   onKeyDown={(e) => {
                  //     if (e.key === "Enter") {
                  //       saveToLocalStorage(e);
                  //     }
                  //   }}
                />

                <Button
                  onClick={saveToLocalStorage}
                  variant="outline"
                  className="w-full mt-2"
                >
                  <span className="sr-only">Add a Thought</span>
                  <span className="text-white">Add Thought</span>
                </Button>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <ul role="list" className="space-y-2 mt-12 mb-24">
          {savedTexts.length > 0 ? (
            savedTexts.map((textItem, index) => (
              <li key={textItem.id}>
                <div className="px-4 border border-[#333] hover:bg-[#111] transition-all duration-200 rounded-md relative flex justify-between items-center gap-x-6 py-2">
                  <div className="flex gap-x-4">
                    {/* <div className="bg-gray-200 dark:bg-[#333] w-10 h-10 animate-pulse rounded-md" /> */}
                    <div className="min-w-0 flex-auto">
                      <p className="mt-1 flex text-xs leading-5 text-white text-justify">
                        <span className="relative truncate max-w-sm hover:underline">
                          {textItem.text}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                      <p className="mt-1 text-xs leading-5 text-[#999]">
                        Created{" "}
                        <time>
                          {textItem.createdTime
                            ? textItem.createdTime.toLocaleString()
                            : ""}
                        </time>
                      </p>
                    </div>
                    {/* <Button variant="ghost" size="sm">
                      <BookOpen
                        className="h-5 w-5 flex-none text-gray-400 cursor-pointer z-30"
                        aria-hidden="true"
                      />
                    </Button> */}
                    <div className="flex items-center space-x-2">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <div className="flex items-center">
                            <Button variant="outline" size="xs">
                              <BookOpen
                                className="h-5 w-5 flex-none text-gray-400 cursor-pointer z-30"
                                aria-hidden="true"
                              />
                            </Button>
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Bytes used for this bookmark: {textItem.size}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[#999]">
                              {textItem.text}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Button variant="ghost" size="xs">
                        <Trash2
                          className="h-5 w-5 flex-none text-gray-400 cursor-pointer z-30"
                          onClick={() => deleteTextItem(textItem.id)}
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <h1 className="text-center text-2xl font-semibold">
              No bookmarks yet. You should change that!
            </h1>
          )}

          <div className="fixed bottom-0 left-0 right-0 p-4 z-50 bg-white">
            <div className="mx-auto max-w-2xl">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <Progress
                      className="w-full"
                      value={remainingStoragePercentage}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your remaining storage:</p>

                    <p className="text-center">
                      <span className="font-bold">{remainingSpace}</span> bytes
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
}
