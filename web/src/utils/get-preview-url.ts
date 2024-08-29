import { ChangeEvent } from "react"

export function onMediaSelected(e: ChangeEvent<HTMLInputElement>) {
  const { files } = e.target
  if (!files) {
    return undefined
  }
  const previewUrl = URL.createObjectURL(files[0])
  return previewUrl
}