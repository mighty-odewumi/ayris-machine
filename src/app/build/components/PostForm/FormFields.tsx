interface FormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
}

export default function FormFields({ title, setTitle, content, setContent }: FormFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-md font-medium mb-2 text-white">Title</label>
        <input
          type="text"
          value={title}
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 border rounded-lg text-black"
        />
      </div>

      <div>
        <label className="block text-md font-medium mb-2 text-white">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
          name='content'
          className="w-full p-3 border rounded-lg text-black"
        />
      </div>
    </>
  )
}