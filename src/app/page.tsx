"use client"
import React from "react"
import { HeaderNav } from "./Navbar"
import { BigCard } from "./BigCard"

export default function Home() {
        return (
                <div className="relative min-h-screen overflow-hidden">
                        {/* Gradient background */}
                        <div className="gradient-background" />
                        
                        {/* Animated blobs */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="animated-blob blob-morph bg-indigo-400 w-[800px] h-[800px] -top-[400px] -left-[400px]" />
                                <div className="animated-blob blob-morph animation-delay-2000 bg-fuchsia-400 w-[800px] h-[800px] -bottom-[400px] -right-[400px]" />
                                <div className="animated-blob blob-morph animation-delay-4000 bg-violet-400 w-[600px] h-[600px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10">
                                <HeaderNav />
                                <main className="container mx-auto px-4">
                                        <BigCard />
                                </main>
                        </div>
                </div>
        )
} 