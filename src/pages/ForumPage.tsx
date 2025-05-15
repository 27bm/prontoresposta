import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Send, ThumbsUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ForumQuestion {
  id: string;
  title: string;
  description: string;
  created_at: string;
  likes: number;
  answers?: ForumAnswer[];
}

interface ForumAnswer {
  id: string;
  question_id: string;
  content: string;
  created_at: string;
  likes: number;
}

const ForumPage = () => {
  const [questions, setQuestions] = useState<ForumQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newQuestion, setNewQuestion] = useState({ title: '', description: '' });
  const [newAnswers, setNewAnswers] = useState<Record<string, string>>({});
  const [answering, setAnswering] = useState<string | null>(null);

  // Fetch questions and answers
  const fetchQuestions = async () => {
    setIsLoading(true);
    
    try {
      const { data: questionsData, error: questionsError } = await supabase
        .from('forum_questions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (questionsError) throw questionsError;
      
      const { data: answersData, error: answersError } = await supabase
        .from('forum_answers')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (answersError) throw answersError;
      
      // Group answers by question_id
      const answersMap: Record<string, ForumAnswer[]> = {};
      answersData?.forEach(answer => {
        if (!answersMap[answer.question_id]) {
          answersMap[answer.question_id] = [];
        }
        answersMap[answer.question_id].push(answer as ForumAnswer);
      });
      
      // Combine questions with their answers
      const questionsWithAnswers = questionsData?.map(q => ({
        ...q,
        answers: answersMap[q.id] || []
      })) as ForumQuestion[];
      
      setQuestions(questionsWithAnswers);
    } catch (error) {
      console.error('Error fetching forum data:', error);
      toast.error('Erro ao carregar as perguntas do fórum.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    
    // Set up realtime subscriptions
    const questionChannel = supabase
      .channel('forum-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'forum_questions' },
        () => fetchQuestions()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'forum_answers' },
        () => fetchQuestions()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(questionChannel);
    };
  }, []);
  
  // Handle adding a new question
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newQuestion.title.trim() || !newQuestion.description.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('forum_questions')
        .insert([{ 
          title: newQuestion.title, 
          description: newQuestion.description
        }]);
        
      if (error) throw error;
      
      setNewQuestion({ title: '', description: '' });
      toast.success('Pergunta adicionada com sucesso!');
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Erro ao adicionar pergunta.');
    }
  };
  
  // Handle adding an answer to a question
  const handleAddAnswer = async (questionId: string) => {
    const content = newAnswers[questionId]?.trim();
    
    if (!content) {
      toast.error('A resposta não pode estar vazia.');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('forum_answers')
        .insert([{ 
          question_id: questionId, 
          content 
        }]);
        
      if (error) throw error;
      
      // Clear the answer field and reset answering state
      setNewAnswers(prev => ({...prev, [questionId]: ''}));
      setAnswering(null);
      toast.success('Resposta adicionada com sucesso!');
    } catch (error) {
      console.error('Error adding answer:', error);
      toast.error('Erro ao adicionar resposta.');
    }
  };
  
  // Handle liking a question
  const handleLikeQuestion = async (questionId: string, currentLikes: number) => {
    try {
      const { error } = await supabase
        .from('forum_questions')
        .update({ likes: currentLikes + 1 })
        .eq('id', questionId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error liking question:', error);
      toast.error('Erro ao curtir a pergunta.');
    }
  };
  
  // Handle liking an answer
  const handleLikeAnswer = async (answerId: string, currentLikes: number) => {
    try {
      const { error } = await supabase
        .from('forum_answers')
        .update({ likes: currentLikes + 1 })
        .eq('id', answerId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error liking answer:', error);
      toast.error('Erro ao curtir a resposta.');
    }
  };
  
  // Filter and sort questions
  const filteredAndSortedQuestions = useMemo(() => {
    // First filter by search query if present
    let filtered = questions;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = questions.filter(q => 
        q.title.toLowerCase().includes(query) || 
        q.description.toLowerCase().includes(query)
      );
    }
    
    // Sort: first questions with no answers, then by likes
    return [...filtered].sort((a, b) => {
      // If a has no answers and b has answers
      if ((!a.answers || a.answers.length === 0) && (b.answers && b.answers.length > 0)) {
        return -1;
      }
      // If b has no answers and a has answers
      if ((!b.answers || b.answers.length === 0) && (a.answers && a.answers.length > 0)) {
        return 1;
      }
      // Then sort by likes
      return b.likes - a.likes;
    });
  }, [questions, searchQuery]);
  
  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Pesquisar perguntas..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Add new question form */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="font-semibold text-lg mb-4 text-gray-800">Faça uma nova pergunta</h2>
          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div>
              <Input
                placeholder="Título da pergunta"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Textarea
                placeholder="Descrição detalhada da sua dúvida"
                value={newQuestion.description}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
            <Button type="submit" className="bg-police-blue hover:bg-police-lightBlue">
              Enviar Pergunta
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Questions list */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-gray-800">Perguntas do Fórum</h2>
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-pulse text-center">
              <p className="text-gray-700">Carregando perguntas...</p>
            </div>
          </div>
        ) : filteredAndSortedQuestions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-700">Nenhuma pergunta encontrada. Seja o primeiro a perguntar!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedQuestions.map((question) => (
              <Card 
                key={question.id} 
                className={`overflow-hidden ${
                  (!question.answers || question.answers.length === 0) 
                    ? 'border-red-300 bg-amber-50'
                    : 'border-green-300 bg-white'
                }`}
              >
                <CardContent className="p-4 space-y-4">
                  {/* Question */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{question.title}</h3>
                    <p className="text-gray-700 mt-2 whitespace-pre-wrap">{question.description}</p>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleLikeQuestion(question.id, question.likes)}
                        className="flex items-center gap-1 text-sm"
                      >
                        <ThumbsUp className="h-4 w-4" /> {question.likes}
                      </Button>
                      <span className="text-xs text-gray-700">
                        {new Date(question.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Answers section */}
                  {question.answers && question.answers.length > 0 && (
                    <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200">
                      <h4 className="font-medium text-gray-800">Respostas:</h4>
                      
                      {question.answers.map((answer) => (
                        <div key={answer.id} className="bg-gray-50 rounded-md p-3">
                          <p className="text-gray-700">{answer.content}</p>
                          
                          <div className="mt-2 flex justify-between items-center">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleLikeAnswer(answer.id, answer.likes)}
                              className="flex items-center gap-1 text-sm"
                            >
                              <ThumbsUp className="h-3 w-3" /> {answer.likes}
                            </Button>
                            <span className="text-xs text-gray-700">
                              {new Date(answer.created_at).toLocaleString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Add answer section */}
                  <div className="mt-4">
                    {answering === question.id ? (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Digite sua resposta..."
                          value={newAnswers[question.id] || ''}
                          onChange={(e) => setNewAnswers(prev => ({ 
                            ...prev, 
                            [question.id]: e.target.value 
                          }))}
                          className="w-full"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setAnswering(null)}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-police-blue hover:bg-police-lightBlue"
                            onClick={() => handleAddAnswer(question.id)}
                          >
                            <Send className="h-4 w-4 mr-1" /> Enviar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setAnswering(question.id)}
                        className="w-full mt-2"
                      >
                        Responder
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
