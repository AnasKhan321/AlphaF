'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Trash2, ShieldAlert, ShieldCheck } from 'lucide-react'
import { BASE_URL } from '@/auth'
import axios from 'axios'
import toast from "react-hot-toast"


interface User {
  id: string
  email: string
  imageurl: string
  name: string
  isRestricted: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])

  console.log(BASE_URL)
  const fetchUsers = async () => {
    const {data} = await axios.get(`${BASE_URL}/api/auth/users`)
    setUsers(data.users)
  }


  useEffect(() => {

    fetchUsers()
  }, [])

  const handleRemoveUser = async (userId: string) => {
    // Replace with your actual API call
    try {
        console.log(userId)
        await axios.delete(`${BASE_URL}/api/auth/users/${userId}`)
        setUsers(users.filter(user => user.id !== userId))
        toast.success("Deleted Successfully !")
    } catch (error) {
        toast.error("Something went wrong")
    }
  }

  const handleToggleRestriction = async (email: string, currentStatus: boolean) => {
    // Replace with your actual API call
    try {
        const data  = {
            email : email , 
            value : !currentStatus
        }
        await axios.patch(`${BASE_URL}/api/auth/users`, data)

        setUsers(users.map(user => 
            user.email === email ? { ...user, isRestricted: !currentStatus } : user
        ))
        toast.success("Updated Successfully ! ")

    } catch (error) {
        toast.error("Something Went Wrong!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13111C] to-purple-900 p-8">
      <Card className="w-full  w-full md:max-w-4xl mx-auto bg-white/10 backdrop-blur-md border-purple-500/20">
        <CardHeader>
          <CardTitle className=" text-md  md:text-3xl font-bold text-white flex items-center justify-center gap-2">
            <ShieldCheck className=" h-4 w-4  md:h-8 md:w-8 text-pink-500" />
            Admin Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {users.map(user => (
              <Card key={user.id} className="bg-white/5 backdrop-blur-sm border-purple-500/20">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.imageurl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className=" text-sm  md:text-lg font-semibold text-white">{user.name}</h3>
                      <p className=" text-xs md:text-sm text-purple-200">{user.email}</p>
                    </div>
                  </div>
                  <div className=" hidden md:flex items-center space-x-2">
                    <Switch
                      checked={!user.isRestricted}
                      onCheckedChange={() => handleToggleRestriction(user.email, user.isRestricted)}
                      className="data-[state=checked]:bg-pink-500"
                    />
                    <span className="text-sm text-purple-200">
                      {user.isRestricted ? (
                        <ShieldAlert className=" h-2 w-2  md:h-5 md:w-5 text-pink-500" />
                      ) : (
                        <ShieldCheck className="h-2 w-2  md:h-5 md:w-5 text-green-500" />
                      )}
                    </span>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveUser(user.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="h-2 w-2  md:h-4 md:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

