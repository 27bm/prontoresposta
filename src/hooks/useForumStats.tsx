
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useForumStats() {
  const [unansweredQuestions, setUnansweredQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUnansweredQuestions = async () => {
      try {
        // First get all questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('forum_questions')
          .select('id');
          
        if (questionsError) throw questionsError;
        
        // Then get questions with answers
        const { data: answersData, error: answersError } = await supabase
          .from('forum_answers')
          .select('question_id')
          .order('question_id');
          
        if (answersError) throw answersError;
        
        // Get unique question IDs that have answers
        const questionIdsWithAnswers = new Set(answersData.map(answer => answer.question_id));
        
        // Count questions without answers
        const unansweredCount = questionsData.filter(
          question => !questionIdsWithAnswers.has(question.id)
        ).length;
        
        setUnansweredQuestions(unansweredCount);
      } catch (error) {
        console.error('Error fetching forum stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnansweredQuestions();
    
    // Set up realtime subscription for changes
    const channel = supabase
      .channel('forum-stats-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'forum_questions' },
        () => fetchUnansweredQuestions()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'forum_answers' },
        () => fetchUnansweredQuestions()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { unansweredQuestions, isLoading };
}
