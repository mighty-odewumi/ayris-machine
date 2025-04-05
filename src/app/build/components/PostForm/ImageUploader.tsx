import Image from 'next/image'

interface ImageUploaderProps {
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
}

export default function ImageUploader({ previewUrl, setPreviewUrl }: ImageUploaderProps) {
  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => setPreviewUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-white">Image (optional)</label>
      <input
        type="file"
        accept="image/*"
        name='image'
        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
        className="w-full p-3 border rounded-lg"
      />
      {previewUrl && (
        <div className="mt-4 relative w-64 h-64">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  )
}