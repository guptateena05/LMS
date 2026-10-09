"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  GripVertical, 
  Type, 
  Heading as HeadingIcon, 
  List as ListIcon, 
  Upload as UploadIcon, 
  Table as TableIcon, 
  HelpCircle, 
  FileText, 
  Code, 
  Terminal,
  Search,
  ChevronDown,
  X,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';

type BlockType = 'text' | 'heading' | 'list' | 'upload' | 'table' | 'quiz' | 'assignment' | 'programming' | 'codebox';

interface Block {
  id: string;
  type: BlockType;
  content: string | string[];
}

const BLOCK_OPTIONS = [
  { id: 'text', label: 'Text', icon: Type },
  { id: 'heading', label: 'Heading', icon: HeadingIcon },
  { id: 'list', label: 'List', icon: ListIcon },
  { id: 'upload', label: 'Upload', icon: UploadIcon },
  { id: 'table', label: 'Table', icon: TableIcon },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle },
  { id: 'assignment', label: 'Assignment', icon: FileText },
  { id: 'programming', label: 'Programming Exercise', icon: Code },
  { id: 'codebox', label: 'CodeBox', icon: Terminal },
];

import { useRouter } from 'next/navigation';
import { createLesson } from '@/services/lms.services';
import { Loader2 } from 'lucide-react';

export default function LessonEditor({ courseId = "aaaaaaakk", chapterId = "" }: { courseId?: string, chapterId?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [instructorNotesOpen, setInstructorNotesOpen] = useState(false);
  const [instructorNotes, setInstructorNotes] = useState('');
  
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'text', content: '' }
  ]);
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeDotsMenuId, setActiveDotsMenuId] = useState<string | null>(null);
  const [menuFilter, setMenuFilter] = useState('');

  const addBlock = (index: number, type: BlockType) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substring(7),
      type,
      content: type === 'list' ? [''] : ''
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setActiveMenuId(null);
  };

  const updateBlock = (id: string, content: string | string[]) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(b => b.id !== id));
    }
    setActiveDotsMenuId(null);
  };

  const moveBlockUp = (index: number) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    setBlocks(newBlocks);
    setActiveDotsMenuId(null);
  };

  const moveBlockDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    setBlocks(newBlocks);
    setActiveDotsMenuId(null);
  };

  const handleSave = async () => {
    if (!title) {
      alert("Please enter a title");
      return;
    }
    setActionLoading(true);
    try {
      const htmlBody = blocks.map(block => {
        if (block.type === 'heading') return `<h2>${block.content}</h2>`;
        if (block.type === 'list' && Array.isArray(block.content)) {
          return `<ul>${block.content.map(li => `<li>${li}</li>`).join('')}</ul>`;
        }
        if (block.type === 'upload' && typeof block.content === 'string' && block.content.startsWith('data:image')) {
          return `<img src="${block.content}" alt="uploaded" style="max-width: 100%; border-radius: 8px;" />`;
        }
        if (block.type === 'table') return `<pre className="table-block">${block.content}</pre>`;
        if (block.type === 'quiz') return `<div className="quiz-block" data-id="${block.content}">[Quiz: ${block.content}]</div>`;
        if (block.type === 'assignment') return `<div className="assignment-block" data-id="${block.content}">[Assignment: ${block.content}]</div>`;
        if (block.type === 'programming') return `<div className="programming-block" data-id="${block.content}">[Programming Exercise: ${block.content}]</div>`;
        if (block.type === 'codebox') return `<pre><code>${block.content}</code></pre>`;
        if (block.type === 'text') return `<p>${block.content}</p>`;
      }).join('\\n');

      const fd = new FormData();
      fd.append('course', courseId);
      fd.append('chapter', chapterId);
      fd.append('title', title);
      fd.append('body', htmlBody);
      // We can also append instructor_notes or include_preview if the backend supports it

      await createLesson(fd);
      alert('Lesson created successfully');
      router.push(`/course/${courseId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to save lesson');
    } finally {
      setActionLoading(false);
    }
  };

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.block-menu-container')) {
        setActiveMenuId(null);
      }
      if (!(e.target as Element).closest('.dots-menu-container')) {
        setActiveDotsMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const renderBlockMenu = (index: number, blockId: string) => {
    if (activeMenuId !== blockId) return null;

    const filteredOptions = BLOCK_OPTIONS.filter(opt => 
      opt.label.toLowerCase().includes(menuFilter.toLowerCase())
    );

    return (
      <div className="absolute top-10 left-0 z-50 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden block-menu-container animate-in fade-in zoom-in-95 duration-100">
        <div className="p-2 border-b border-slate-100 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Filter" 
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border-none rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
            value={menuFilter}
            onChange={(e) => setMenuFilter(e.target.value)}
            autoFocus
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-1">
          {filteredOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => addBlock(index, opt.id as BlockType)}
              className="w-full flex items-center px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <div className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center mr-3 shadow-sm text-slate-500">
                <opt.icon className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">{opt.label}</span>
            </button>
          ))}
          {filteredOptions.length === 0 && (
            <div className="p-4 text-center text-sm text-slate-500">No matching blocks</div>
          )}
        </div>
      </div>
    );
  };

  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case 'text':
        return (
          <textarea
            className="w-full resize-none text-slate-800 placeholder:text-slate-300 focus:outline-none text-sm min-h-[40px] py-1 bg-transparent"
            placeholder="Type '/' for commands or start writing..."
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && block.content === '') {
                e.preventDefault();
                removeBlock(block.id);
              }
            }}
          />
        );
      case 'heading':
        return (
          <input
            type="text"
            className="w-full text-lg font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none py-1 bg-transparent"
            placeholder="Heading..."
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
          />
        );
      case 'list':
        return (
          <div className="pl-4 border-l-2 border-indigo-200 space-y-2 py-1">
            {Array.isArray(block.content) && block.content.map((item, i) => (
              <div key={i} className="flex items-start">
                <span className="text-indigo-400 mr-2 mt-1.5 text-base leading-none">•</span>
                <input
                  type="text"
                  className="flex-1 focus:outline-none text-sm text-slate-800 bg-transparent"
                  placeholder="List item..."
                  value={item}
                  onChange={(e) => {
                    const newContent = [...block.content];
                    newContent[i] = e.target.value;
                    updateBlock(block.id, newContent);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const newContent = [...block.content];
                      newContent.splice(i + 1, 0, '');
                      updateBlock(block.id, newContent);
                    } else if (e.key === 'Backspace' && item === '') {
                      e.preventDefault();
                      const newContent = [...block.content];
                      if (newContent.length > 1) {
                        newContent.splice(i, 1);
                        updateBlock(block.id, newContent);
                      } else {
                        removeBlock(block.id);
                      }
                    }
                  }}
                  autoFocus={i === block.content.length - 1}
                />
              </div>
            ))}
          </div>
        );
      case 'upload':
        return (
          <div className="relative group/upload border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer overflow-hidden min-h-[120px]">
            {typeof block.content === 'string' && block.content.startsWith('data:image') ? (
              <img src={block.content} alt="Preview" className="max-w-md max-h-48 object-contain rounded-lg p-2" />
            ) : (
              <div className="p-6 flex flex-col items-center pointer-events-none">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 mb-2 group-hover/upload:scale-105 transition-transform">
                  <UploadIcon className="w-4 h-4 text-indigo-500" />
                </div>
                <h4 className="font-semibold text-slate-700 text-sm">Click to upload</h4>
                <p className="text-xs text-slate-500 mt-1">Image, Video, Audio or PDF</p>
              </div>
            )}
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    updateBlock(block.id, event.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        );
      case 'table':
        return (
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div className="flex items-center gap-2 mb-2 text-slate-500 font-semibold text-sm">
              <TableIcon className="w-4 h-4" /> Markdown Table
            </div>
            <textarea
              className="w-full resize-none bg-white border border-slate-200 rounded-lg p-3 text-slate-700 font-mono text-sm focus:outline-none focus:border-indigo-500 min-h-[100px]"
              placeholder="| Column 1 | Column 2 |\n|----------|----------|\n| Data 1   | Data 2   |"
              value={block.content as string}
              onChange={(e) => updateBlock(block.id, e.target.value)}
            />
          </div>
        );
      case 'quiz':
      case 'assignment':
      case 'programming':
        const iconMap = { quiz: HelpCircle, assignment: FileText, programming: Code };
        const Icon = iconMap[block.type as keyof typeof iconMap];
        return (
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 text-indigo-500">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{block.type} ID or URL</label>
              <input
                type="text"
                className="w-full bg-white border border-slate-200 rounded p-2 text-sm focus:outline-none focus:border-indigo-500"
                placeholder={`Enter ${block.type} ID...`}
                value={block.content as string}
                onChange={(e) => updateBlock(block.id, e.target.value)}
              />
            </div>
          </div>
        );
      case 'codebox':
        return (
          <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
            <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-300">Code Snippet</span>
            </div>
              <textarea
              className="w-full resize-none bg-transparent text-slate-100 font-mono text-xs p-4 focus:outline-none min-h-[120px]"
              placeholder="// Write your code here..."
              value={block.content as string}
              onChange={(e) => updateBlock(block.id, e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center text-sm">
          <Link href={`/`} className="text-slate-500 hover:text-slate-900 transition-colors font-medium">Courses</Link>
          <span className="mx-2 text-slate-300">/</span>
          <Link href={`/course/${courseId}`} className="text-slate-500 hover:text-slate-900 transition-colors font-medium">
            {decodeURIComponent(courseId || "")}
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-900 font-bold">Create Lesson</span>
        </div>
        <button 
          onClick={handleSave}
          disabled={actionLoading}
          className="bg-slate-900 text-white px-5 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
        >
          {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
        </button>
      </header>

      <div className="flex-1 max-w-[1400px] w-full mx-auto flex flex-col lg:flex-row">
        {/* Main Editor Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Title Settings */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xl font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none py-2 bg-transparent"
                  placeholder="Untitled Lesson"
                />
              </div>
            </div>

            {/* Instructor Notes Accordion */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setInstructorNotesOpen(!instructorNotesOpen)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="font-semibold text-slate-700">Instructor Notes</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${instructorNotesOpen ? 'rotate-180' : ''}`} />
              </button>
              {instructorNotesOpen && (
                <div className="p-4 bg-white border-t border-slate-200">
                  <textarea 
                    value={instructorNotes}
                    onChange={(e) => setInstructorNotes(e.target.value)}
                    placeholder="Add private notes for instructors here..."
                    className="w-full h-32 resize-none focus:outline-none text-slate-700 placeholder:text-slate-300"
                  />
                </div>
              )}
            </div>

            {/* Blocks Content Area */}
            <div className="pt-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Content</h3>
              
              <div className="space-y-2">
                {blocks.map((block, index) => (
                  <div key={block.id} className="group relative flex items-start -ml-12 pl-12 py-1">
                    {/* Block Controls */}
                    <div className="absolute left-0 top-1.5 opacity-40 hover:opacity-100 transition-opacity flex items-center space-x-1 block-menu-container">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === block.id ? null : block.id);
                          setActiveDotsMenuId(null);
                          setMenuFilter('');
                        }}
                        className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                        title="Add block below"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <div className="relative dots-menu-container">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDotsMenuId(activeDotsMenuId === block.id ? null : block.id);
                            setActiveMenuId(null);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded"
                          title="Block options"
                        >
                          <GripVertical className="w-4 h-4" />
                        </button>

                        {/* Dots Menu Popover */}
                        {activeDotsMenuId === block.id && (
                          <div className="absolute top-8 left-0 z-50 w-40 bg-white rounded-lg shadow-xl border border-slate-200 py-1 animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={() => moveBlockUp(index)}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                              disabled={index === 0}
                            >
                              Move Up
                            </button>
                            <button
                              onClick={() => moveBlockDown(index)}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                              disabled={index === blocks.length - 1}
                            >
                              Move Down
                            </button>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button
                              onClick={() => removeBlock(block.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                              disabled={blocks.length === 1}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Floating Menu */}
                      {renderBlockMenu(index, block.id)}
                    </div>
                    
                    {/* Block Content */}
                    <div className="flex-1 w-full relative">
                      {renderBlockContent(block)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
