"use client";

import React from "react";
import {
  containerVariants,
  itemVariants,
} from "@/lib/motion-variants/variants";
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
import { Badge } from "@/components/ui/badge";

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

import { motion } from "framer-motion";

import { useToast } from "@/components/ui/use-toast";
import { HelpCircle, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/vent/navbar";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

interface TextItem {
  text: string;
  id: number;
  size: number;
  createdTime: string;
  categories: string[];
}

export default function Home() {
  let { toast } = useToast();

  let [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  let [inputText, setInputText] = React.useState<string>("");
  let [savedTexts, setSavedTexts] = React.useState<TextItem[]>([]);
  let [categories, setCategories] = React.useState<string[]>([]);
  let [currentCategories, setCurrentCategories] = React.useState<string[]>([]);
  let [remainingSpace, setRemainingSpace] = React.useState<number>(0);
  let [remainingStoragePercentage, setRemainingStoragePercentage] =
    React.useState<number>(100);

  let [selectedCategory, setSelectedCategory] = React.useState<string>("");
  let [query, setQuery] = React.useState<string>("");
  const filteredTexts = savedTexts.filter((textItem) => {
    if (
      query !== "" &&
      !textItem.text.toLowerCase().includes(query.toLowerCase())
    ) {
      return false;
    }
    if (
      selectedCategory !== "" &&
      !textItem.categories.includes(selectedCategory)
    ) {
      return false;
    }
    return true;
  });

  React.useEffect(() => {
    let storedTexts = localStorage.getItem("texts");

    if (storedTexts) {
      setSavedTexts(JSON.parse(storedTexts));
    }
    logRemainingLocalStorageSpace();
  }, []);

  React.useEffect(() => {
    const allCategories = new Set<string>();
    savedTexts.forEach((textItem) => {
      textItem.categories.forEach((category) => {
        allCategories.add(category);
      });
    });
    setCategories(Array.from(allCategories));
  }, [savedTexts]);

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
        categories: currentCategories, // use currentCategories here
      },
    ];

    localStorage.setItem("texts", JSON.stringify(newTexts));
    setSavedTexts(newTexts);
    setInputText("");
    setCategories([]); // Clear categories input after saving

    // console log what is saved
    console.log(newTexts);

    toast({
      title: "Success!",
      description: "Your bookmark has been saved.",
    });
    setCurrentCategories([]); // clear currentCategories

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
              <Select onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" onSelect={() => setSelectedCategory("")}>
                    All
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      onSelect={() => setSelectedCategory(category)}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="text"
                autoComplete="off"
                placeholder="Search entries"
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full mt-6">
                  <span className="sr-only">Add a Thought</span>
                  <span className="text-white">Add a Thought</span>
                </Button>
              </SheetTrigger>
              <SheetContent position="right" size="sm">
                <SheetHeader>
                  <SheetTitle>
                    What&apos;s on your mind?
                    {/*  */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-red-500">*</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>required</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Textarea
                    placeholder="This can be anything on your mind. A link to a website, an image, or just plain text."
                    className="text-white"
                    value={inputText}
                    //   @ts-ignore
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-4 py-4">
                  <div className="flex justify-between">
                    <Label
                      htmlFor="category"
                      className="text-white items-center justify-center flex"
                    >
                      Categorize entry? (optional)
                    </Label>

                    {/* <HelpCircle className="text-white" /> */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="text-white" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>press enter to add multiple categories</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {/* category input */}
                  <Input
                    type="text"
                    id="category"
                    placeholder="ex. Design"
                    autoComplete="off"
                    className="text-white"
                    onKeyDown={(e) => {
                      const target = e.target as HTMLInputElement; // cast e.target to HTMLInputElement
                      if (e.key === "Enter" && target.value.trim() !== "") {
                        setCurrentCategories([
                          ...currentCategories,
                          target.value,
                        ]);
                        target.value = "";
                        e.preventDefault(); // To prevent form submission on pressing 'Enter'
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap">
                  <div className="flex flex-wrap">
                    {currentCategories.map((category, index) => (
                      <Badge
                        key={index}
                        variant="default"
                        className="mr-2 mb-2 cursor-pointer"
                        onClick={() => {
                          setCurrentCategories(
                            currentCategories.filter((cat) => cat !== category)
                          );
                        }}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                <SheetFooter>
                  <Button
                    onClick={async (e) => {
                      await saveToLocalStorage(e);
                      setCategories([]);
                      setInputText("");
                    }}
                    disabled={inputText.trim() === ""}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    <span className="sr-only">Add a Thought</span>
                    <span className="text-white">Add Thought</span>
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>

        <motion.ul
          role="list"
          className="space-y-2 mt-12 mb-24"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredTexts.length > 0
            ? filteredTexts.map((textItem, index) => (
                <motion.li
                  key={textItem.id}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  variants={itemVariants}
                  style={{
                    transition: "all 0.2s ease",
                    filter:
                      hoveredIndex !== null && hoveredIndex !== index
                        ? "blur(3px)"
                        : "",
                  }}
                >
                  <AlertDialog>
                    <AlertDialogTrigger className="w-full">
                      <div className="px-4 border border-[#333] hover:bg-[#111] transition-all duration-200 rounded-md relative flex justify-between items-center gap-x-6 py-2">
                        <div className="flex flex-col gap-x-4">
                          <div className="min-w-0 flex-auto">
                            <p className="mt-1 flex text-xs leading-5 text-white text-justify">
                              <span className="relative truncate max-w-sm hover:underline">
                                {textItem.text}
                              </span>
                            </p>
                          </div>
                          <p className="text-left text-xs leading-5 text-[#999]">
                            Created{" "}
                            <time>
                              {textItem.createdTime
                                ? textItem.createdTime.toLocaleString()
                                : ""}
                            </time>
                          </p>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="default" className="mr-2">
                              {textItem.categories &&
                              textItem.categories.length > 0
                                ? textItem.categories[0]
                                : "Main"}
                            </Badge>

                            <Button variant="ghost">
                              <Trash2
                                className="h-5 w-5 flex-none text-gray-400 cursor-pointer z-30"
                                onClick={() => deleteTextItem(textItem.id)}
                                aria-hidden="true"
                              />
                            </Button>
                          </div>
                        </div>
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
                </motion.li>
              ))
            : null}
          {/* No songs */}
          {savedTexts.length === 0 && (
            <h1 className="text-white text-center mt-12">
              Your thoughts will appear here
            </h1>
          )}
          <div className="fixed bottom-0 left-0 right-0 p-4 z-50 bg-black border-t border-[#333]">
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
        </motion.ul>
      </div>
    </div>
  );
}
