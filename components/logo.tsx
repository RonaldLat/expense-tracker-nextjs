import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Logo() {
   return (
      <Link href="/" className="flex items-center">
      <p>expense tracker</p>
         {/* <Image */}
         {/*    src={'/logo2.png'} */}
         {/*    alt="Logo" */}
         {/*    width={114} */}
         {/*    height={64} */}
         {/*    priority */}
         {/* /> */}
      </Link>
   )
}
