"use client";
import MonacoEditor from "@monaco-editor/react";
import React, { useEffect, useState } from "react";
import { useEditorStore } from "../store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import config from "../config";
import examples from "@/config/examples";
import { redirect, usePathname } from "next/navigation";
import { handleShareCode } from "@/app/data/serverActions";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { Input } from "./ui/input";

import { toast } from "sonner";

interface CodeEditorInterface {
  code: string | undefined;
  roomId: string | undefined;
  language: string | undefined;
}

const CollabEditor = ({ language, roomId, code }: CodeEditorInterface) => {
  const onEditorMount = useEditorStore((state) => state.setEditorState);
  const setTheme = useEditorStore((state) => state.setSelectedTheme);
  const theme = useEditorStore((state) => state.theme);

  const [editorlanguage, setEditorlanguage] = useState(language);
  const [defaultValue, setDefaultValue] = useState<string>(code as string);
  const [codeValue, setCodeValue] = useState<string | undefined>(defaultValue);
  const [shareDisabled, setShareDisabled] = useState<boolean>(true);

  const pathName = usePathname();

  console.log(pathName);

  const router = useRouter();

  function handleEditorDidMount() {
    onEditorMount(true);
  }

  function handleLanguageChange(e: any) {
    setEditorlanguage(e);

    const lang = config.supportedLanguages.find((lang) => lang.name === e)!;

    setDefaultValue(examples[lang.id]);
  }

  async function handleShare() {
    const nanoId = nanoid();

    const res = await handleShareCode(
      codeValue as string,
      editorlanguage as string,
      nanoId
    );

    if (res === 200) {
      router.push(`/${nanoId}`);
    }
  }

  const handleEditorChange = async (value: string | undefined) => {
    console.log("Editor content changed:", value);
    setCodeValue(value);

    if (!shareDisabled) return;
    setShareDisabled(false);
  };

  return (
    <div
      className={`h-[680px] ${
        theme === "light" ? "bg-white" : "bg-[#1E1E1E]"
      }   py-5 rounded-xl -translate-y-[80.5%] `}
    >
      <MonacoEditor
        className="h-full rounded-xl "
        defaultLanguage={editorlanguage}
        theme={theme}
        path={editorlanguage}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        defaultValue={defaultValue}
      />
      <div
        className={`flex ${
          theme === "light" ? "bg-white" : "bg-[#1E1E1E]"
        } p-4 rounded-br-xl rounded-bl-xl`}
      >
        <Select onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-min max-w-64 bg-[#CDD6E1]  rounded-3xl">
            <SelectValue placeholder="HTML" />
          </SelectTrigger>
          <SelectContent className="w-56">
            {config.supportedLanguages.map((lang) => (
              <SelectItem key={lang.id} value={lang.name}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(e) => setTheme(e)}>
          <SelectTrigger className="w-max max-w-64 ml-4 capitalize bg-[#CDD6E1] rounded-3xl">
            <SelectValue placeholder="Light" />
          </SelectTrigger>
          <SelectContent defaultValue={"Light"}>
            {config.defaultThemes.map((theme) => (
              <SelectItem value={theme}>{theme}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.hostname}:${window.location.port}/${roomId}`
            );

            toast.success("Link Copied");
          }}
          className="max-w-64 ml-auto mr-4 cursor-pointer flex items-center "
        >
          <svg
            className={`w-8 h-8 ${
              theme === "vs-dark" ? "text-white" : "text-gray-800 "
            } `}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"
            />
          </svg>

          <Input
            readOnly
            className={`border-none ${
              theme === "vs-dark" && "text-white"
            } outline-none bg-transparent cursor-pointer rounded-3xl`}
            value={`../${roomId}`}
          />
        </div>

        <button
          onClick={handleShare}
          disabled={shareDisabled}
          className=" z-100 disabled:bg-gray-500 disabled:cursor-not-allowed bg-blue-600 flex items-center gap-2 text-white px-8 py-2 text-xl rounded-3xl"
        >
          <svg
            className="w-6 h-6 inline-block text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M7.926 10.898 15 7.727m-7.074 5.39L15 16.29M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm12 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0-11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
            />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
};

export default CollabEditor;
