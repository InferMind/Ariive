// This is a mock implementation for the web preview
// In a real app, this would use Capacitor plugins for native functionality

export interface AudioFile {
  id: string
  name: string
  path: string
  isCustom: boolean
}

class CapacitorAudioManager {
  private static instance: CapacitorAudioManager
  private audioPlayer: HTMLAudioElement | null = null
  private customRingtones: AudioFile[] = []

  private constructor() {
    // Initialize with some default ringtones
    this.loadSavedRingtones()

    // Create audio player
    if (typeof window !== "undefined") {
      this.audioPlayer = new Audio()
    }
  }

  public static getInstance(): CapacitorAudioManager {
    if (!CapacitorAudioManager.instance) {
      CapacitorAudioManager.instance = new CapacitorAudioManager()
    }
    return CapacitorAudioManager.instance
  }

  private loadSavedRingtones(): void {
    // In a real app, this would load from device storage
    if (typeof window !== "undefined") {
      const savedRingtones = localStorage.getItem("custom-ringtones")
      if (savedRingtones) {
        try {
          this.customRingtones = JSON.parse(savedRingtones)
        } catch (e) {
          console.error("Failed to parse saved ringtones", e)
          this.customRingtones = []
        }
      }
    }
  }

  private saveRingtones(): void {
    // In a real app, this would save to device storage
    if (typeof window !== "undefined") {
      localStorage.setItem("custom-ringtones", JSON.stringify(this.customRingtones))
    }
  }

  public async pickAudioFile(): Promise<AudioFile | null> {
    // In a real app, this would use Capacitor's FilePicker plugin
    // For web preview, we'll use the browser's file input
    return new Promise((resolve) => {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "audio/*"

      input.onchange = async (e) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]

        if (!file) {
          resolve(null)
          return
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("File size must be less than 5MB")
          resolve(null)
          return
        }

        // Create a unique ID and file path
        const id = `custom_${Date.now()}`
        const name = file.name.replace(/\.[^/.]+$/, "") // Remove extension

        // In a real app, we would save the file to device storage
        // For web preview, we'll use object URLs
        const path = URL.createObjectURL(file)

        const audioFile: AudioFile = {
          id,
          name,
          path,
          isCustom: true,
        }

        this.customRingtones.push(audioFile)
        this.saveRingtones()

        resolve(audioFile)
      }

      input.click()
    })
  }

  public getDefaultRingtones(): AudioFile[] {
    return [
      { id: "default", name: "Default", path: "/sounds/default.mp3", isCustom: false },
      { id: "gentle_bell", name: "Gentle Bell", path: "/sounds/gentle_bell.mp3", isCustom: false },
      { id: "chime", name: "Chime", path: "/sounds/chime.mp3", isCustom: false },
      { id: "buzzer", name: "Buzzer", path: "/sounds/buzzer.mp3", isCustom: false },
      { id: "nature", name: "Nature Sounds", path: "/sounds/nature.mp3", isCustom: false },
      { id: "classical", name: "Classical", path: "/sounds/classical.mp3", isCustom: false },
      { id: "electronic", name: "Electronic", path: "/sounds/electronic.mp3", isCustom: false },
    ]
  }

  public getCustomRingtones(): AudioFile[] {
    return this.customRingtones
  }

  public getAllRingtones(): AudioFile[] {
    return [...this.getDefaultRingtones(), ...this.customRingtones]
  }

  public getRingtoneById(id: string): AudioFile | undefined {
    return this.getAllRingtones().find((ringtone) => ringtone.id === id)
  }

  public async playRingtone(id: string): Promise<void> {
    const ringtone = this.getRingtoneById(id)
    if (!ringtone || !this.audioPlayer) return

    try {
      this.audioPlayer.pause()
      this.audioPlayer.src = ringtone.path
      await this.audioPlayer.play()
    } catch (error) {
      console.error("Failed to play ringtone", error)
    }
  }

  public stopPlayback(): void {
    if (this.audioPlayer) {
      this.audioPlayer.pause()
      this.audioPlayer.currentTime = 0
    }
  }

  public async deleteCustomRingtone(id: string): Promise<boolean> {
    const index = this.customRingtones.findIndex((ringtone) => ringtone.id === id)
    if (index === -1) return false

    // In a real app, we would delete the file from device storage
    // For web preview, we'll just remove it from our array
    const ringtone = this.customRingtones[index]
    if (ringtone.path.startsWith("blob:")) {
      URL.revokeObjectURL(ringtone.path)
    }

    this.customRingtones.splice(index, 1)
    this.saveRingtones()

    return true
  }
}

export const audioManager = CapacitorAudioManager.getInstance()
