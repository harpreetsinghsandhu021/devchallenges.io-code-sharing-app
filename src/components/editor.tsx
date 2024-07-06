"use client";
import MonacoEditor from "@monaco-editor/react";
import React, { useState } from "react";
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
import { redirect } from "next/navigation";
import { handleShareCode } from "@/app/data/serverActions";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";

const CodeEditor = () => {
  const language = useEditorStore((state) => state.language);
  const onEditorMount = useEditorStore((state) => state.setEditorState);
  const setLanguage = useEditorStore((state) => state.setSelectedLanguage);
  const setTheme = useEditorStore((state) => state.setSelectedTheme);
  const theme = useEditorStore((state) => state.theme);

  const defaultValue = examples[language.id];
  const router = useRouter();

  const [codeValue, setCodeValue] = useState<string | undefined>(defaultValue);

  function handleEditorDidMount() {
    onEditorMount(true);
  }

  function handleLanguageChange(e: any) {
    setLanguage(e);
  }

  async function handleShare() {
    const nanoId = nanoid();

    const res = await handleShareCode(
      codeValue as string,
      language.name,
      nanoId
    );

    if (res === 200) {
      router.push(`/${nanoId}`);
    }
  }

  const handleEditorChange = async (value: string | undefined) => {
    console.log("Editor content changed:", value);
    setCodeValue(value);
  };

  return (
    <div
      className={`h-[680px] ${
        theme === "light" ? "bg-white" : "bg-[#1E1E1E]"
      }   py-5 rounded-xl -translate-y-[80.5%] `}
    >
      {defaultValue && (
        <MonacoEditor
          className="h-full rounded-xl "
          defaultLanguage={language.name}
          theme={theme}
          path={language.name}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          defaultValue={defaultValue}
        />
      )}
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
            {config.defaultThemes.map((theme, index) => (
              <SelectItem key={index} value={theme}>
                {theme}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          onClick={handleShare}
          className="ml-auto z-100 bg-blue-600 flex items-center gap-2 text-white px-8 py-2 text-xl rounded-3xl"
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

export default CodeEditor;
