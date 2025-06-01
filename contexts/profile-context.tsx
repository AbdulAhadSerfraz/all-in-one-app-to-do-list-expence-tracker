"use client"

import React, { createContext, useContext, useState } from 'react'

type ProfileContextType = {
  avatarUrl: string | null
  setAvatarUrl: (url: string | null) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  return (
    <ProfileContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
