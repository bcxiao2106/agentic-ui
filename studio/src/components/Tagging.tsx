'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTags } from '@/hooks/useTags';
import type { ToolTag } from '@/types/api';

interface TaggingProps {
  tags: number[];
  onAddTag: (tag: number) => void;
  onRemoveTag: (tag: number) => void;
}

const Tagging: React.FC<TaggingProps> = ({ tags, onAddTag, onRemoveTag }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all tags from API
  const { data: tagsResponse, isLoading, error } = useTags();
  const availableTags = tagsResponse?.data || [];

  // Filter tags based on search term
  const filteredTags = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected tag details for display
  const selectedTags = availableTags.filter((tag) => tags.includes(tag.tag_id));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleAddTag = (tagId: number) => {
    if (!tags.includes(tagId)) {
      onAddTag(tagId);
    }
  };

  const handleOpenDropdown = () => {
    setIsDropdownOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Selected Tags Display Area */}
      <div className="min-h-[60px] p-4 border border-gray-200 rounded-lg bg-gray-50">
        {selectedTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag.tag_id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm transition-all hover:shadow-md"
                style={{
                  backgroundColor: tag.color || '#6B7280',
                  color: 'white',
                }}
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag.tag_id)}
                  className="hover:bg-white/30 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${tag.name}`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No tags selected. Click below to add tags.</p>
        )}
      </div>

      {/* Dropdown Trigger Button */}
      <div className="relative w-1/2" ref={dropdownRef}>
        <button
          type="button"
          onClick={handleOpenDropdown}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-left flex items-center justify-between"
        >
          <span className="text-gray-700">
            {selectedTags.length > 0
              ? `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''} selected`
              : 'Select tags...'}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Overlay */}
        {isDropdownOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tags..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Tags List */}
            <div className="max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-pulse">Loading tags...</div>
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">
                  <p className="text-sm">Failed to load tags</p>
                  <p className="text-xs mt-1">{error.message}</p>
                </div>
              ) : filteredTags.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">
                    {searchTerm ? 'No tags found' : 'No tags available'}
                  </p>
                </div>
              ) : (
                <div className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {filteredTags.map((tag) => {
                      const isSelected = tags.includes(tag.tag_id);
                      return (
                        <button
                          key={tag.tag_id}
                          type="button"
                          onClick={() => handleAddTag(tag.tag_id)}
                          disabled={isSelected}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            isSelected
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:shadow-md hover:scale-105 cursor-pointer'
                          }`}
                          style={{
                            backgroundColor: tag.color || '#6B7280',
                            color: 'white',
                          }}
                          title={tag.description || tag.name}
                        >
                          {tag.name}
                          {isSelected && (
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with count */}
            {!isLoading && !error && filteredTags.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
                {selectedTags.length > 0
                  ? `${selectedTags.length} of ${availableTags.length} selected`
                  : `${availableTags.length} tags available`}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tagging;
