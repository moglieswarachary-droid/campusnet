import React from 'react';
import { useApp } from '../../context/AppContext';
import { Video, Heart, MessageSquare, Play, ArrowRight } from 'lucide-react';

export const StoriesSection: React.FC = () => {
  const { stories, setActiveTab, toggleLikeStory } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-campus-warm-white border-t border-campus-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-campus-red text-xs font-bold border border-red-200 mb-2">
              <Video className="w-3.5 h-3.5" />
              Academic Demo Reels & Field Pitches
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-campus-deep-blue">
              Campus Stories: Innovation in Motion
            </h2>
            <p className="text-sm text-campus-muted-text mt-1 max-w-xl">
              Real prototype demonstrations, hackathon sprint moments, and laboratory field trials shared directly by verified students.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('stories')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-campus-blue hover:underline"
          >
            Watch All Demos
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {stories.map(story => (
            <div
              key={story.id}
              onClick={() => setActiveTab('stories')}
              className="bg-white rounded-3xl overflow-hidden border border-campus-border shadow-warm-md hover:shadow-warm-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              {/* Thumbnail with overlay */}
              <div className="relative h-64 overflow-hidden bg-black">
                <img
                  src={story.thumbnailUrl}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Category Pill */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="text-[11px] font-bold bg-campus-deep-blue/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full">
                    {story.category}
                  </span>
                </div>

                {/* Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-campus-red/90 text-white flex items-center justify-center shadow-glow-red group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>

                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <div className="text-xs font-semibold text-gray-200">{story.creatorCollege}</div>
                  <div className="text-sm font-bold text-white line-clamp-1">{story.title}</div>
                </div>
              </div>

              {/* Bottom interactions */}
              <div className="p-4 flex items-center justify-between text-xs text-campus-slate-text">
                <div className="flex items-center gap-2">
                  <img
                    src={story.creatorAvatar}
                    alt={story.creatorName}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-campus-border"
                  />
                  <span className="font-semibold text-xs text-campus-slate-text">{story.creatorName}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLikeStory(story.id);
                    }}
                    className={`flex items-center gap-1 font-semibold ${
                      story.isLiked ? 'text-campus-red' : 'text-campus-muted-text hover:text-campus-red'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${story.isLiked ? 'fill-campus-red' : ''}`} />
                    {story.likesCount}
                  </button>

                  <div className="flex items-center gap-1 text-campus-muted-text">
                    <MessageSquare className="w-4 h-4" />
                    {story.commentsCount}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
