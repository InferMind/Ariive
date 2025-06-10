"use client"

import { useState, useEffect } from "react"
import { Volume2, Plus, Trash2, Play, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { audioManager, type AudioFile } from "@/lib/capacitor-audio"

interface CustomRingtonePickerProps {
  selectedRingtone: string
  onRingtoneSelect: (ringtoneId: string) => void
}

export function CustomRingtonePicker({ selectedRingtone, onRingtoneSelect }: CustomRingtonePickerProps) {
  const [ringtones, setRingtones] = useState<AudioFile[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [isAddingRingtone, setIsAddingRingtone] = useState(false)

  useEffect(() => {
    // Load all ringtones
    const allRingtones = audioManager.getAllRingtones()
    setRingtones(allRingtones)
  }, [])

  const handleAddCustomRingtone = async () => {
    setIsAddingRingtone(true)
    try {
      const newRingtone = await audioManager.pickAudioFile()
      if (newRingtone) {
        setRingtones([...audioManager.getAllRingtones()])
        onRingtoneSelect(newRingtone.id)
      }
    } catch (error) {
      console.error("Error adding custom ringtone:", error)
    } finally {
      setIsAddingRingtone(false)
    }
  }

  const handleDeleteRingtone = async (id: string) => {
    if (currentlyPlaying === id) {
      audioManager.stopPlayback()
      setIsPlaying(false)
      setCurrentlyPlaying(null)
    }

    const success = await audioManager.deleteCustomRingtone(id)
    if (success) {
      setRingtones([...audioManager.getAllRingtones()])

      // If the deleted ringtone was selected, switch to default
      if (selectedRingtone === id) {
        onRingtoneSelect("default")
      }
    }
  }

  const handlePlayRingtone = async (id: string) => {
    if (isPlaying && currentlyPlaying === id) {
      audioManager.stopPlayback()
      setIsPlaying(false)
      setCurrentlyPlaying(null)
      return
    }

    if (isPlaying) {
      audioManager.stopPlayback()
    }

    setIsPlaying(true)
    setCurrentlyPlaying(id)

    try {
      await audioManager.playRingtone(id)

      // Auto-stop after 3 seconds
      setTimeout(() => {
        if (currentlyPlaying === id) {
          audioManager.stopPlayback()
          setIsPlaying(false)
          setCurrentlyPlaying(null)
        }
      }, 3000)
    } catch (error) {
      console.error("Error playing ringtone:", error)
      setIsPlaying(false)
      setCurrentlyPlaying(null)
    }
  }

  const selectedRingtoneName = ringtones.find((r) => r.id === selectedRingtone)?.name || "Default"
  const customRingtones = ringtones.filter((r) => r.isCustom)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Select value={selectedRingtone} onValueChange={onRingtoneSelect}>
          <SelectTrigger>
            <SelectValue>{selectedRingtoneName}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {ringtones.map((ringtone) => (
              <SelectItem key={ringtone.id} value={ringtone.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{ringtone.name}</span>
                  {ringtone.isCustom && <span className="text-xs text-gray-500">(Custom)</span>}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handlePlayRingtone(selectedRingtone)}
          className="flex items-center gap-2"
          disabled={isPlaying && currentlyPlaying !== selectedRingtone}
        >
          {isPlaying && currentlyPlaying === selectedRingtone ? (
            <>
              <Square className="h-4 w-4" />
              Stop
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Preview
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddCustomRingtone}
          className="flex items-center gap-2"
          disabled={isAddingRingtone}
        >
          <Plus className="h-4 w-4" />
          {isAddingRingtone ? "Adding..." : "Add Custom"}
        </Button>
      </div>

      {customRingtones.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Custom Ringtones</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {customRingtones.map((ringtone) => (
              <div
                key={ringtone.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm truncate max-w-[150px]">{ringtone.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePlayRingtone(ringtone.id)}
                  >
                    {isPlaying && currentlyPlaying === ringtone.id ? (
                      <Square className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteRingtone(ringtone.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
