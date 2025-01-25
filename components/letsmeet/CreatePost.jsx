'use client';
import { useState, useRef } from 'react';
import { Link, Image, Video, Bold, Italic, List, ListOrdered } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CreatePost = ({ user, category, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const linkInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'header': [1, 2, 3, false] }],
      ['clean']
    ],
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMediaUrl(data.url);
      setUploadProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
      setUploadProgress(0);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/letsmeet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          imageUrl: mediaUrl,
          linkUrl,
          category,
          authorId: user.id,
          authorName: user.fullName,
          authorImage: user.imageUrl,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to create post');

      const newPost = await response.json();
      onPostCreated(newPost);
      setContent('');
      setMediaUrl('');
      setLinkUrl('');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-start space-x-3">
        <img
          src={user?.imageUrl}
          alt={user?.fullName}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="What's on your mind?"
            className="mb-4"
          />

          {mediaUrl && (
            <div className="mt-2 relative">
              {mediaUrl.includes('image') ? (
                <img
                  src={mediaUrl}
                  alt="Uploaded content"
                  className="max-h-96 rounded-lg object-cover"
                />
              ) : (
                <video
                  src={mediaUrl}
                  controls
                  className="max-h-96 rounded-lg w-full"
                />
              )}
              <button
                onClick={() => setMediaUrl('')}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1"
              >
                ×
              </button>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {linkUrl && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <input
                ref={linkInputRef}
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Enter URL"
                className="w-full bg-transparent border-none focus:outline-none"
              />
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex space-x-2">
              <label className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                />
                <Image className="w-5 h-5" />
              </label>
              
              <button
                onClick={() => setLinkUrl(linkUrl ? '' : 'https://')}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <Link className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost; 