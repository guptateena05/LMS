import React from 'react';
import LessonEditor from '@/components/admin/LessonEditor';

export default async function CreateLessonPage({ params }: { params: Promise<{ courseId: string, chapterId: string }> | { courseId: string, chapterId: string } }) {
  const p = await params;
  return (
    <LessonEditor courseId={p.courseId} chapterId={p.chapterId} />
  );
}
