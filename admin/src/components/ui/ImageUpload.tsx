import { useEffect, useState } from "react"

interface ImageUploadProps {
    value: string,
    onChange: (base64: string) => void,
    disabled?: boolean
}

function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null)
    useEffect(() => {
        if (value) {
            setPreview(value)
        }
    }, [value])

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = (error) => reject(error)
        })
    }

    return (
        <div>image upload</div>
    )
}

export default ImageUpload