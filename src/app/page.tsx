import Image from "next/image";
import CodeEditor from "../components/editor";

export default function Home() {
  return (
    <main className=" bg-gradient-to-br from-[#B787F5] to-[#743EE4] ">
      <div className="relative w-full h-[800px]">
        <Image
          src={"/Hero-Background-notecode@2x.png"}
          alt="hero"
          fill
          className="h-auto"
        />
      </div>

      <div className="absolute flex flex-col items-center text-black text-4xl left-1/2 top-8 -translate-x-1/2 ">
        <Image
          alt=""
          src={"/NoteCodeLogo.svg"}
          width={10}
          height={10}
          className="w-28 h-auto"
        />
        <h2 className="capitalize pt-8 text-[32px] font-semibold">
          create & share
        </h2>
        <h1 className="capitalize pt-4 text-[40px] font-semibold ">
          your code easily
        </h1>
      </div>
      <div className="relative max-w-screen-lg mx-auto h-80">
        <CodeEditor />
      </div>
    </main>
  );
}
