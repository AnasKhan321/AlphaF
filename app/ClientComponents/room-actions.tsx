'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import axios from "axios"
import { BASE_URL } from "@/auth"
import { LogIn, PlusCircle, Loader2 } from 'lucide-react'
import toast from "react-hot-toast"


interface RoomActionsProps {
  userEmail: string
}

export function RoomActions({ userEmail }: RoomActionsProps) {
  const [roomId, setRoomId] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {

      return
    }

    setIsJoining(true)
    try {
      const { data } = await axios.get(`${BASE_URL}/api/room/rooms/${roomId}`)
      if (data.exsists) {
        router.push(`/room/${roomId}`)
      } else {
        toast.error("Enter Correct RoomId")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsJoining(false)
    }
  }

  const handleCreateRoom = async () => {
    setIsCreating(true)
    try {
      const { data } = await axios.post(`${BASE_URL}/api/room/createroom`, { email: userEmail })
      router.push(`/room/${data.id}`)
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className=" bg-purple-600 text-white hover:text-white    border-purple-300 hover:bg-purple-800   transition-all duration-300"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Join a Room
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-800">Join a Room</DialogTitle>
            <DialogDescription className="text-purple-600">
              Enter the Room ID to join an existing room.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="border-purple-300 focus:border-pink-500 focus:ring-pink-500"
            />
            <Button 
              onClick={handleJoinRoom} 
              className="bg-purple-600 hover:bg-purple-700 text-white  "
              disabled={isJoining}
            >
              {isJoining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Join Room
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Button 
        onClick={handleCreateRoom}
        className="bg-pink-500 hover:bg-pink-600 text-white transition-all duration-300"
        disabled={isCreating}
      >
        {isCreating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create a Room
          </>
        )}
      </Button>
    </div>
  )
}

