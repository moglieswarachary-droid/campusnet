import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, Search, ThumbsUp, CheckCircle2, 
  MessageSquare, Plus, Tag, ArrowRight, UserCheck, ShieldCheck 
} from 'lucide-react';
import { AskQuestion } from '../../types';

export const AskCampusView: React.FC = () => {
  const { 
    askQuestions, addAskQuestion, upvoteQuestion, 
    addAnswerToQuestion, markBestAnswer, currentUser 
  } = useApp();

  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newTags, setNewTags] = useState('Edge-AI, ROS2');
  const [activeAnswerQuestionId, setActiveAnswerQuestionId] = useState<string | null>(null);
  const [answerBody, setAnswerBody] = useState('');

  const tags = ['All', 'ROS2', 'UAV-Dynamics', 'TensorRT', 'Edge-AI', 'Biomedical', 'Sensors'];

  const filteredQuestions = askQuestions.filter(q => {
    const matchesTag = selectedTag === 'All' || q.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase());
    const matchesSearch = !searchQuery || 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    const tagArray = newTags.split(',').map(t => t.trim()).filter(Boolean);
    addAskQuestion(newTitle, newBody, tagArray);
    setNewTitle('');
    setNewBody('');
    setIsAskModalOpen(false);
  };

  const handlePostAnswer = (questionId: string) => {
    if (!answerBody.trim()) return;
    addAnswerToQuestion(questionId, answerBody);
    setAnswerBody('');
    setActiveAnswerQuestionId(null);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-campus-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="campus-badge-verified">
              <HelpCircle className="w-3.5 h-3.5" />
              Ask Campus • Academic Problem Solving
            </span>
            <span className="text-xs text-campus-muted-text">Peer & Faculty Q&A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-deep-blue">
            Solve Hard Engineering & Research Problems
          </h1>
          <p className="text-xs sm:text-sm text-campus-muted-text mt-1">
            Ask questions on hardware circuits, model quantization, drone dynamics, and clinical validation answered by verified peers and faculty mentors.
          </p>
        </div>

        <button
          onClick={() => setIsAskModalOpen(true)}
          className="campus-btn-red text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-warm-md"
        >
          <Plus className="w-4 h-4" />
          Ask a Question
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-campus-border shadow-warm-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-campus-muted-text absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search problems by keyword (e.g. TensorRT, ROS2)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {tags.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedTag === t
                  ? 'bg-campus-deep-blue text-white shadow-warm-sm'
                  : 'bg-campus-warm-white text-campus-slate-text hover:bg-campus-soft-blue border border-campus-border'
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Feed */}
      <div className="space-y-6">
        {filteredQuestions.map(q => (
          <div 
            key={q.id}
            className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all space-y-4"
          >
            <div className="flex items-start gap-4">
              
              {/* Upvote column */}
              <button
                onClick={() => upvoteQuestion(q.id)}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                  q.isUpvoted
                    ? 'bg-campus-soft-blue border-campus-blue text-campus-blue font-bold shadow-sm'
                    : 'bg-campus-warm-white border-campus-border text-campus-slate-text hover:border-campus-blue'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${q.isUpvoted ? 'fill-campus-blue' : ''}`} />
                <span className="text-xs font-extrabold mt-1">{q.upvotes}</span>
              </button>

              {/* Question Body */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-campus-muted-text">
                    Asked by <strong>{q.authorName}</strong> ({q.authorCollege})
                  </span>
                  {q.hasAcceptedAnswer && (
                    <span className="text-[10.5px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Solution
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-campus-deep-blue leading-snug">
                  {q.title}
                </h3>

                <p className="text-xs sm:text-sm text-campus-slate-text/90 leading-relaxed">
                  {q.body}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {q.tags.map(tag => (
                    <span key={tag} className="text-[10.5px] font-semibold bg-campus-soft-blue text-campus-blue px-2.5 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Answers Section */}
            {q.answers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-campus-border space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-campus-muted-text">
                  Answers & Solutions ({q.answers.length}):
                </div>

                {q.answers.map(ans => (
                  <div
                    key={ans.id}
                    className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                      ans.isAccepted 
                        ? 'bg-green-50/70 border-green-300' 
                        : 'bg-campus-warm-white border-campus-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={ans.authorAvatar} alt={ans.authorName} className="w-6 h-6 rounded-lg object-cover" />
                        <span className="font-bold text-campus-deep-blue">{ans.authorName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ans.authorBadge === 'Verified Mentor' ? 'bg-red-100 text-campus-red' : 'bg-blue-100 text-campus-blue'
                        }`}>
                          {ans.authorBadge}
                        </span>
                      </div>

                      {ans.isAccepted ? (
                        <span className="text-green-800 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Best Answer
                        </span>
                      ) : (
                        <button
                          onClick={() => markBestAnswer(q.id, ans.id)}
                          className="text-[11px] font-bold text-campus-blue hover:underline"
                        >
                          Mark as Best Answer
                        </button>
                      )}
                    </div>

                    <p className="text-campus-slate-text">{ans.body}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Answer Input Box */}
            <div className="pt-2 border-t border-campus-border flex items-center justify-between">
              {activeAnswerQuestionId === q.id ? (
                <div className="w-full space-y-2 pt-2">
                  <textarea
                    rows={3}
                    value={answerBody}
                    onChange={e => setAnswerBody(e.target.value)}
                    placeholder="Provide detailed technical guidance, code snippets, or formulas..."
                    className="w-full p-3 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setActiveAnswerQuestionId(null)}
                      className="campus-btn-secondary text-xs py-1.5 px-3"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handlePostAnswer(q.id)}
                      className="campus-btn-primary text-xs py-1.5 px-4"
                    >
                      Post Answer
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setActiveAnswerQuestionId(q.id)}
                  className="text-xs font-bold text-campus-blue hover:underline flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contribute an Answer
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Ask Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 bg-campus-deep-blue/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-warm-xl border border-campus-border space-y-4">
            <h3 className="text-lg font-bold text-campus-deep-blue">Ask the Campus Innovation Network</h3>
            <p className="text-xs text-campus-muted-text">
              Explain the specific obstacle or hardware anomaly. Verified mentors and peers will review.
            </p>

            <form onSubmit={handlePostQuestion} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">
                  Question Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. How to prevent thermal throttling on Jetson Orin Nano with 3D printed duct?"
                  className="w-full px-3.5 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">
                  Detailed Explanation & Steps Taken
                </label>
                <textarea
                  rows={4}
                  value={newBody}
                  onChange={e => setNewBody(e.target.value)}
                  placeholder="Include sensor values, error logs, and firmware configurations..."
                  className="w-full p-3 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="Edge-AI, ROS2, Hardware"
                  className="w-full px-3.5 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="campus-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="campus-btn-red text-xs"
                >
                  Publish Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
