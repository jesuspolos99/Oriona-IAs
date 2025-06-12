"use client"

import { useState } from "react"
import { Card, CardHeader } from "@/components/ui/card"

interface SimpleStatsProps {
  isOpen: boolean
  onClose: () => void
}

export default function SimpleStats({ isOpen, onClose }: SimpleStatsProps) {
  const [stats] = useState({
    style: ["neutral", "formal", "informal", "enthusiastic"][Math.floor(Math.random() * 4)],
    formality: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
    vocabularyCount: Math.floor(Math.random() * 30) + 5,
    memoriesCount: Math.floor(Math.random() * 5) + 1,
    interests: ["tecnología", "ciencia", "historia", "arte", "música", "viajes", "literatura"].slice(
      0,
      Math.floor(Math.random() * 3) + 1,
    ),
    personalityTraits: ["curioso", "analítico", "creativo", "detallista", "empático"].slice(
      0,
      Math.floor(Math.random() * 3) + 1,
    ),
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className\
