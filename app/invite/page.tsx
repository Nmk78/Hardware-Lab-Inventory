// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useToast } from "@/hooks/use-toast"


// export default function InviteUserPage() {
//   const [email, setEmail] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     // try {
//     //   const result = await inviteUser(email)
//     //   if (result.success) {
//     //     toast({
//     //       title: "Invitation Sent",
//     //       description: result.message,
//     //     })
//     //     setEmail("")
//     //   } else {
//     //     throw new Error(result.message)
//     //   }
//     // } catch (error) {
//     //   toast({
//     //     title: "Error",
//     //     description: error instanceof Error ? error.message : "An unexpected error occurred",
//     //     variant: "destructive",
//     //   })
//     // } finally {
//     //   setIsLoading(false)
//     // }
//   }

//   return (
//     <div className="min-h-full flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Invite User</h1>
//         </div>
//         <form onSubmit={handleSubmit} className="mt-8 space-y-4">
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <Label htmlFor="email" className="sr-only">
//                 Email Address
//               </Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={isLoading}
//               />
//             </div>
//           </div>

//           <div>
//             <Button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               disabled={isLoading}
//             >
//               {isLoading ? "Sending..." : "Send Invitation"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function InviteUserPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

  }

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Invite User
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="email" className="sr-only">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
