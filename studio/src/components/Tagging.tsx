import React, { useState } from 'react';

interface TaggingProps {
  tags: number[];
  onAddTag: (tag: number) => void;
  onRemoveTag: (tag: number) => void;
}

const Tagging: React.FC<TaggingProps> = ({ tags, onAddTag, onRemoveTag }) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    const tagNumber = parseInt(newTag, 10);
    if (!isNaN(tagNumber) && !tags.includes(tagNumber)) {
      onAddTag(tagNumber);
      setNewTag('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 w-1/2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Enter tag ID"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full flex items-center gap-2"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Tagging;
