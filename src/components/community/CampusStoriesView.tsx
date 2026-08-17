import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Video, Heart, MessageSquare, Bookmark, Share2, 
  Play, Pause, Volume2, VolumeX, X, Sparkles, Plus 
} from 'lucide-react';
import { CampusStory } from '../../types';

export const CampusStoriesView: React.FC = () => {
  const { stories, toggleLikeStory, addCommentToStory, addToast } = useApp();

  const [activeStory, setActiveStory] = useState<CampusStory | null>(stories[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [commentInput, setCommentInput] = useState('');

  const categories = ['All', 'Project', 'Hackathon', 'Research', 'Event', 'Achievement'];

  const filteredStories = selectedCategory === 'All' 
    ? stories 
    : stories.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStory || !commentInput.trim()) return;
    addCommentToStory(activeStory.id);
    setCommentInput('');
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-campus-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="campus-badge-mentor">
              <Video className="w-3.5 h-3.5" />
              Academic Demo Reels & Lab Recordings
            </span>
            <span className="text-xs text-campus-muted-text">Short Form Innovation Demos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-deep-blue">
            Campus Stories: Watch Real Projects in Action
          </h1>
          <p className="text-xs sm:text-sm text-campus-muted-text mt-1">
            Hardware field trials, autonomous drone flights, patient EMG bionic tests, and hackathon sprint recaps.
          </p>
        </div>

        <button
          onClick={() => {
            addToast({
              type: 'info',
              title: 'Upload Demo Video',
              message: 'Academic demo video upload modal opened.'
            });
          }}
          className="campus-btn-red text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-warm-md"
        >
          <Plus className="w-4 h-4" />
          Upload Project Demo Reel
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-campus-deep-blue text-white shadow-warm-sm'
                : 'bg-white text-campus-slate-text hover:bg-campus-soft-blue border border-campus-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stories Grid & Active Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Video Player (7 Cols) */}
        {activeStory && (
          <div className="lg:col-span-7 bg-black rounded-3xl overflow-hidden shadow-warm-xl border border-campus-border flex flex-col justify-between relative min-h-[500px]">
            {/* Native Video Element */}
            <video
              src={activeStory.videoUrl}
              poster={activeStory.thumbnailUrl}
              controls
              playsInline
              className="w-full h-full object-contain max-h-[550px]"
            />

            {/* Video Metadata Overlay */}
            <div className="p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activeStory.creatorAvatar}
                    alt={activeStory.creatorName}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/30"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{activeStory.creatorName}</h4>
                    <p className="text-xs text-gray-300">{activeStory.creatorDept} • {activeStory.creatorCollege}</p>
                  </div>
                </div>

                <span className="text-xs font-bold bg-campus-red text-white px-3 py-1 rounded-full">
                  {activeStory.category}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {activeStory.title}
              </h3>

              <div className="flex items-center justify-between pt-2 border-t border-white/15 text-xs text-gray-300">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLikeStory(activeStory.id)}
                    className={`flex items-center gap-1.5 font-bold ${
                      activeStory.isLiked ? 'text-campus-bright-red' : 'hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${activeStory.isLiked ? 'fill-campus-bright-red' : ''}`} />
                    <span>{activeStory.likesCount} Likes</span>
                  </button>

                  <div className="flex items-center gap-1.5 font-semibold">
                    <MessageSquare className="w-4 h-4" />
                    <span>{activeStory.commentsCount} Comments</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToast({
                      type: 'info',
                      title: 'Story Link Copied',
                      message: 'Shareable link copied to clipboard.'
                    });
                  }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                  title="Share Demo"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stories Playlist & Comments Side (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="font-bold text-sm uppercase tracking-wider text-campus-deep-blue">
            More Academic Demos ({filteredStories.length})
          </h3>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {filteredStories.map(story => (
              <div
                key={story.id}
                onClick={() => setActiveStory(story)}
                className={`p-3.5 rounded-3xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  activeStory?.id === story.id
                    ? 'bg-campus-soft-blue border-campus-blue shadow-warm-sm scale-[1.01]'
                    : 'bg-white border-campus-border hover:bg-campus-warm-white'
                }`}
              >
                <div className="relative w-24 h-16 rounded-2xl overflow-hidden bg-black flex-shrink-0">
                  <img
                    src={story.thumbnailUrl}
                    alt={story.title}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-4 h-4 fill-white text-white" />
                  </div>
                  <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white bg-black/60 px-1 rounded">
                    {story.duration}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase text-campus-red truncate">
                      {story.category}
                    </span>
                    <span className="text-[10px] text-campus-muted-text">{story.creatorCollege.split('(')[0]}</span>
                  </div>
                  
                  <h4 className="text-xs font-bold text-campus-deep-blue line-clamp-1 mt-0.5">
                    {story.title}
                  </h4>

                  <p className="text-[11px] text-campus-muted-text mt-0.5 truncate">
                    By {story.creatorName}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Comment Input */}
          <form onSubmit={handlePostComment} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              placeholder="Leave academic feedback on demo..."
              className="flex-1 px-3.5 py-2 text-xs bg-white rounded-xl border border-campus-border focus:border-campus-blue outline-none"
            />
            <button type="submit" className="campus-btn-primary text-xs py-2 px-3 rounded-xl">
              Comment
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
