'use client'
import { useEffect, useState, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { useSession } from 'next-auth/react'
import { Send, Paperclip, File, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "axios"
import { BASE_URL } from "@/auth"
import {toast}  from 'react-hot-toast'

enum MessageType {
  Message,
  Join,
  File
}

interface Message {
  id: string
  content: string
  sender: string
  timestamp: number
  messagetype: MessageType
  fileUrl?: string
  fileName?: string
}

export default function Chat({ id }: { id: string }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileurl , setfileurl]  = useState("")

  useEffect(() => {
    const so = io("ws://d9ay5rmqf0duw.cloudfront.net")
    setSocket(so)

    so.emit("roomjoin", { id, email: session?.user?.email })

    so.on("message:received", (data) => {
      setMessages((prevMessages) => [...prevMessages, {
        id: crypto.randomUUID(),
        content: data.data,
        sender: data.sender || 'Anonymous',
        timestamp: Date.now(),
        messagetype: MessageType.Message
      }])
    })

    so.on("file:received", (data) => {
      setMessages((prevMessages) => [...prevMessages, {
        id: crypto.randomUUID(),
        content: data.url,
        sender: data.sender || 'Anonymous',
        timestamp: Date.now(),
        messagetype: MessageType.File,
      }])
    })

    so.on("user:joined", (data) => {
      setMessages((prevMessages) => [...prevMessages, {
        id: crypto.randomUUID(),
        content: data.user,
        sender: 'Anonymous',
        timestamp: Date.now(),
        messagetype: MessageType.Join
      }])
    })


    return () => {
      so.disconnect()
    }
  }, [id, session?.user?.email])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (socket && (newMessage.trim() || fileurl.trim())) {
      if (fileurl !== "") {


          socket.emit("file", {
              sender : session?.user?.email , 
              file  : fileurl , 
              roomid : id
          })

        setSelectedFile(null)
      }
      
      if (newMessage.trim()) {
        socket.emit("message", {
          roomid: id,
          message: newMessage,
          sender: session?.user?.email
        })
      }
      setNewMessage("")
    }
  }

  const handleFileSelect = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const {data} = await axios.post(`${BASE_URL}/api/auth/uploadImage`  , {imageName  : file.name  , imageType : file.type  , email : session?.user?.email})

      if(!data.success){
        toast.error(data.message)
        setSelectedFile(null)
        return 
      }
      await axios.put(data.url , file)
      toast.success("uploaded successfully")
      const url = new URL(data.url)
      const signedurl = `${url.origin}${url.pathname}`
      setfileurl(signedurl)
    }
  }

  const getInitials = (email: string) => {
    return email?.split('@')[0]?.slice(0, 2)?.toUpperCase() || '??'
  }

  return (
    <div className="min-h-screen bg-[#13111C] dark p-4">
      <div className="text-center font-bold py-4 text-purple-300">
        Room ID: {id}
      </div>

      <div className="min-h-[650px] max-h-[650px] overflow-y-scroll w-[70%] mx-auto border border-purple-500 p-4 rounded-lg">
        {messages.map((message) => (
          <div key={message.id}>
            {message.messagetype === MessageType.Join && (
              <div className="text-center text-white">
                <b>{message.content === undefined ? "Reconnecting..." : message.content}</b>
                {message.content === undefined ? "" : " Join"}
              </div>
            )}

            {(message.messagetype === MessageType.Message || message.messagetype === MessageType.File) && (
              <div
                className={`flex items-start gap-3 mt-5 ${
                  message.sender === session?.user?.email
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}
              >
                <Avatar className="w-8 h-8 border-2 border-purple-500">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.sender}`} />
                  <AvatarFallback className="bg-purple-900 text-purple-200">
                    {getInitials(message.sender)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[80%] break-words ${
                    message.sender === session?.user?.email
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-[#1D1B25] text-gray-100"
                  }`}
                >
                  <p className="text-sm font-medium mb-1 text-purple-200">
                    {message.sender === session?.user?.email ? "You" : message.sender.split('@')[0]}
                  </p>
                  {message.messagetype === MessageType.File ? (
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      <a
                        href={message.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline hover:text-purple-300"
                        download={true}
                      >
                        DownloadFile
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  <p className="text-xs text-purple-300/70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="w-[70%] mx-auto">
        <form onSubmit={sendMessage} className="flex gap-2 mt-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex-1 flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="bg-[#1D1B25] border-purple-900 text-purple-300 hover:text-purple-200 hover:bg-[#2D2B35]"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-[#1D1B25] border-purple-900 text-white placeholder:text-white"
              />
              {selectedFile && (
                <div className="absolute -top-8 left-0 right-0 bg-[#1D1B25] text-white p-1 rounded-md flex items-center justify-between">
                  <span className="text-sm truncate">{selectedFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-[#2D2B35]"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={!newMessage.trim() && !fileurl.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Send className="h-4 w-4 text-white" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

