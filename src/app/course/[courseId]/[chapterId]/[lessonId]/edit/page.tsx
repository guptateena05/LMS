import React from 'react';
import LessonEditor from '@/components/admin/LessonEditor';

export default function EditLessonPage({ params }: { params: { courseId: string, chapterId: string, lessonId: string } }) {
  return (
    <LessonEditor courseId={params.courseId} />
  );
}
