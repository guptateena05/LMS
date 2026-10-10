"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLesson, getChapters, getLessons, getCourseProgress, createCourseProgress } from '@/services/lms.services';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  
  const courseId = decodeURIComponent(params?.courseId as string);
  const chapterId = decodeURIComponent(params?.chapterId as string);
  const lessonId = decodeURIComponent(params?.lessonId as string);

  const [lessonData, setLessonData] = useState<any>(null);
  const [outline, setOutline] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userEmail, setUserEmail] = useState('');
  const [isInstructor, setIsInstructor] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [isCompletedLocally, setIsCompletedLocally] = useState(false);

  useEffect(() => {
    setUserEmail(localStorage.getItem('userEmail') || localStorage.getItem('user_email') || '');
    setIsInstructor(localStorage.getItem('roles')?.includes('Instructor') || false);
    
    if (!courseId || !chapterId || !lessonId) return;

    const fetchLesson = async () => {
      setLoading(true);
      try {
        const [lessonRes, chaptersRes, lessonsRes, progressRes] = await Promise.allSettled([
          getLesson({ course: courseId, chapter: chapterId, name: lessonId }),
          getChapters({ course: courseId }),
          getLessons({ course: courseId }),
          getCourseProgress(courseId)
        ]);

        if (lessonRes.status === 'fulfilled') {
          setLessonData(lessonRes.value?.data || lessonRes.value?.message || lessonRes.value);
        } else {
          throw new Error('Failed to load lesson content');
        }

        if (chaptersRes.status === 'fulfilled' && lessonsRes.status === 'fulfilled') {
          const rawCh = chaptersRes.value;
          const rawLe = lessonsRes.value;
          const chArray = Array.isArray(rawCh) ? rawCh : (rawCh?.message?.data || rawCh?.data || rawCh?.message || []);
          const leArray = Array.isArray(rawLe) ? rawLe : (rawLe?.message?.data || rawLe?.data || rawLe?.message || []);
          
          const mapped = chArray.map((c: any) => ({
            ...c,
            lessons: leArray.filter((l: any) => l.chapter === c.name)
          }));
          setOutline(mapped);
        }

        if (progressRes.status === 'fulfilled') {
          const rawProgress = progressRes.value;
          setProgress(rawProgress);
        }
      } catch (err: any) {
        setError(err.message || 'Could not load the lesson.');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, chapterId, lessonId]);

  const handleMarkComplete = async () => {
    setUpdatingProgress(true);
    try {
      await createCourseProgress({
        member: userEmail,
        lesson: lessonData.name || lessonId,
        status: "Complete"
      });
      setIsCompletedLocally(true);
      setIsCompletedLocally(true);
      // refresh progress to sync sidebar
      const progressRes = await getCourseProgress(courseId);
      if (progressRes?.message || progressRes?.data || progressRes) {
        setProgress(progressRes);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to update progress');
    } finally {
      setUpdatingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error || !lessonData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex flex-col justify-center items-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lesson Error</h2>
          <p className="text-gray-600">{error || 'Lesson not found.'}</p>
          <button onClick={() => router.push(`/course/${courseId}`)} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full">Back to Course</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <Navbar />

      <div className="flex-grow flex overflow-hidden h-[calc(100vh-80px)]">
        {/* Professional Dark Sidebar */}
        <aside className="w-80 bg-slate-900 border-r border-slate-800 overflow-y-auto hidden md:flex flex-col shadow-xl z-10 relative">
          <div className="p-6 border-b border-slate-800 bg-slate-900 sticky top-0 z-20">
            <Link href={`/course/${courseId}`} className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Course
            </Link>
            <h2 className="font-extrabold text-lg text-white leading-tight line-clamp-2" title={courseId}>{courseId.replace(/-/g, ' ')}</h2>
            
            {/* Progress bar */}
            {progress && (
              <div className="mt-5">
                <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>Course Progress</span>
                  <span className="text-indigo-400">{progress.progress || 0}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${progress.progress || 0}%` }}></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 flex-1 space-y-1">
            {outline.map((chapter: any, cIndex: number) => (
              <div key={chapter.name || cIndex} className="mb-4">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3 pt-2">
                  Chapter {cIndex + 1}: {chapter.title || chapter.chapter_name || chapter.name}
                </h3>
                <ul className="space-y-1">
                  {chapter.lessons?.map((l: any, lIndex: number) => {
                    const isActive = l.name === lessonId && chapter.name === chapterId;
                    return (
                      <li key={l.name || lIndex}>
                        <Link 
                          href={`/course/${courseId}/${encodeURIComponent(chapter.name)}/${encodeURIComponent(l.name)}`}
                          className={`flex items-start px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative ${
                            isActive 
                              ? 'bg-indigo-500/10 text-white font-semibold' 
                              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 font-medium'
                          }`}
                        >
                          {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-md shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>}
                          <CheckCircle className={`w-4 h-4 mt-0.5 mr-3 flex-shrink-0 transition-colors ${
                            progress?.data?.records?.some((r: any) => (r.lesson === l.name || r.lesson === l.title || r.lesson === l.lesson_name) && r.status === 'Complete') || progress?.records?.some((r: any) => (r.lesson === l.name || r.lesson === l.title || r.lesson === l.lesson_name) && r.status === 'Complete') || (isCompletedLocally && isActive)
                              ? 'text-emerald-500' 
                              : isActive ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-500'
                          }`} />
                          <span className="line-clamp-2 leading-snug">{lIndex + 1}. {l.title || l.lesson_name || l.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow overflow-y-auto bg-[#F8FAFC] relative flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
          {/* Subtle Background Decoration */}
          <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-indigo-50 to-transparent pointer-events-none -z-10" />
          {/* Header Banner */}
          <div className="bg-white border-b border-slate-200 px-8 py-5 shadow-sm sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md border border-indigo-100">{chapterId}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {lessonData.title || lessonData.lesson_name || lessonData.name || `Lesson ${lessonId}`}
              </h1>
            </div>
            
            {(() => {
              const flatLessons = outline.flatMap(c => (c.lessons || []).map((l: any) => ({ chapterName: c.name, lessonName: l.name })));
              const currentIndex = flatLessons.findIndex(l => l.chapterName === chapterId && l.lessonName === (lessonData.name || lessonId));
              const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
              const nextLesson = currentIndex !== -1 && currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;
              
              return (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => prevLesson && router.push(`/course/${courseId}/${encodeURIComponent(prevLesson.chapterName)}/${encodeURIComponent(prevLesson.lessonName)}`)}
                    disabled={!prevLesson}
                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 font-semibold text-sm transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => nextLesson && router.push(`/course/${courseId}/${encodeURIComponent(nextLesson.chapterName)}/${encodeURIComponent(nextLesson.lessonName)}`)}
                    disabled={!nextLesson}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm transition-all shadow-sm shadow-indigo-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Lesson <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })()}
          </div>

          <div className="max-w-7xl mx-auto p-4 md:p-8 w-full flex-grow flex flex-col">
            
            {lessonData.description && (
              <div className="mb-8 p-6 bg-indigo-50 border border-indigo-100 rounded-xl">
                <p className="text-lg text-indigo-900 font-medium leading-relaxed">
                  {lessonData.description}
                </p>
              </div>
            )}

            {/* Video Player Box */}
            {lessonData.video_url && (
              <div className="relative rounded-xl overflow-hidden bg-black shadow-xl mb-10 ring-1 ring-slate-900/10">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe 
                    src={lessonData.video_url} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-[400px] md:h-[600px]"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Lesson Body HTML */}
            <div className="bg-white p-8 md:p-14 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex-grow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-20"></div>
              <div className="prose prose-indigo max-w-none text-slate-600 marker:text-indigo-500 prose-headings:font-bold prose-headings:text-slate-800 prose-p:leading-relaxed prose-a:text-indigo-600 hover:prose-a:text-indigo-700 prose-pre:bg-slate-900 prose-pre:shadow-lg prose-pre:rounded-xl" dangerouslySetInnerHTML={{ __html: lessonData.body || lessonData.content || `
                <div class="text-center py-16">
                  <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                    <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                  </div>
                  <h3 class="text-lg font-bold text-slate-900 mb-2">No Text Content Available</h3>
                  <p class="text-slate-500">This lesson does not contain any readable material.</p>
                </div>
              ` }} />
            </div>

            {/* Bottom Action */}
            <div className="mt-10 flex justify-end">
              {(() => {
                const targetLessonStr = lessonData?.name || lessonId;
                const targetLessonTitle = lessonData?.title || lessonData?.lesson_name || '';
                const isLessonCompleted = isCompletedLocally || 
                  progress?.data?.records?.some((r: any) => (r.lesson === targetLessonStr || r.lesson === targetLessonTitle) && r.status === 'Complete') ||
                  progress?.records?.some((r: any) => (r.lesson === targetLessonStr || r.lesson === targetLessonTitle) && r.status === 'Complete');
                
                if (isLessonCompleted) {
                  return (
                    <div className="px-8 py-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-bold flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      Completed
                    </div>
                  );
                }
                
                return (
                  <button 
                    onClick={handleMarkComplete}
                    disabled={updatingProgress}
                    className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-bold transition-all flex items-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {updatingProgress ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    {updatingProgress ? 'Updating...' : 'Mark as Complete'}
                  </button>
                );
              })()}
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}
