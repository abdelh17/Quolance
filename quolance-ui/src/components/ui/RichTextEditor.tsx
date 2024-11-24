import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className='min-h-[200px] rounded-md border border-gray-300' />
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (key: string, value: string) => void;
  name: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  minHeight?: string;
  debounceMs?: number; // Optional debounce timing
}

const RichTextEditor = ({
  value,
  onChange,
  name,
  placeholder = 'Start typing...',
  readOnly = false,
  className = '',
  minHeight = '200px',
  debounceMs = 500,
}: RichTextEditorProps) => {
  const [editorValue, setEditorValue] = useState(value);

  const debounceTimer = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (callback: () => void) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, debounceMs);
    };
  }, [debounceMs]);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }],
          [{ align: [] }],
          ['blockquote', 'link'],
          ['clean'],
        ],
        handlers: {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          image: () => {},
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'align',
    'link',
  ];

  const handleChange = useCallback(
    (content: string) => {
      setEditorValue(content);
      debounceTimer(() => {
        onChange(name, content);
      });
    },
    [name, onChange, debounceTimer]
  );

  return (
    <div className={`relative ${className}`}>
      <style jsx global>{`
        .quill {
          height: 100%;
        }

        .ql-container {
          min-height: ${minHeight};
          font-size: 16px;
          font-family: inherit;
        }

        .ql-editor {
          min-height: ${minHeight};
          max-height: 500px;
          overflow-y: auto;
          padding: 12px 16px;
        }

        .ql-toolbar {
          border-radius: 6px 6px 0 0;
          border-color: rgb(209 213 219);
        }

        .ql-container {
          border-radius: 0 0 6px 6px;
          border-color: rgba(209, 213, 219, 0);
        }

        .quill:focus-within {
          outline: 2px solid #2563eb;
          border-radius: 0.375rem;
        }
      `}</style>
      <ReactQuill
        theme='snow'
        modules={modules}
        formats={formats}
        value={editorValue}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
};

export default RichTextEditor;
