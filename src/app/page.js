"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import TypingAnimation from "@/components/TypingAnimation";
import Form from "@/components/Form";

export default function Home() {
  const [chatLog, setChatLog] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatToFocus = useRef(null);

  useEffect(() => {
    if (chatToFocus.current == null) return;
    console.log(chatToFocus.current);
    chatToFocus.current.scrollTo(0, chatToFocus.current.scrollHeight);
  }, [chatLog]);

  async function send(inputValue) {
    const url = `https://playground-backend-us-east-1-r6k7l.cld-hph1wut9q59u5n6p.s.anyscaleuserdata.com/v1/chat/completions`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ANYSCALE_API_KEY}`,
    };
    const data = {
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct",
      messages: [
        {
          role: "system",
          content:
            "I'm a career advice chatbot. I can only give information about career.",
        },
        {
          role: "user",
          content: inputValue,
        },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
    };
    setIsLoading(true);
    const dataRe = await axios({
      method: "POST",
      url: url,
      data: data,
      headers: headers,
    });
    setIsLoading(false);
    setChatLog((prevChat) => {
      return [
        ...prevChat,
        { type: "bot", message: dataRe.data.choices[0].message.content },
      ];
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!inputValue) return;
    setChatLog((prevChat) => {
      return [...prevChat, { type: "user", message: inputValue }];
    });
    send(inputValue);
    setInputValue("");
  }

  return (
    <div className="container mx-auto max-w-[800px]">
      <div className="flex flex-col h-dvh bg-[rgb(60,58,68,0.39)] rounded-sm overflow-hidden scroll-smooth snap-end">
        <h1 className="bg-gradient-to-r from-blue-500 to-purple-100 text-transparent bg-clip-text text-center py-3 font-bold text-3xl">
          CAREER ADVICE CHAT BOT
        </h1>
        <div className="flex-grow p-6 h-3/5 scroll-smooth snap-proximity">
          <div
            ref={chatToFocus}
            className="flex flex-col space-y-4 h-5/6 overflow-scroll scroll-smooth no-scrollbar"
          >
            {chatLog.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.type === "user" ? "bg-purple-500" : "bg-gray-800"
                  } rounded-lg p-4 text-white max-w-sm scroll-smooth snap-y snap-end`}
                >
                  {message.message}
                </div>
              </div>
            ))}
            {isLoading && (
              <div key={chatLog.length} className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                  <TypingAnimation />
                </div>
              </div>
            )}
          </div>
        </div>
        <Form
          handleSubmit={handleSubmit}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </div>
    </div>
  );
}
