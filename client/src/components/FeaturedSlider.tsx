import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '@/lib/mockData';
import { Link } from 'wouter';

interface FeaturedSliderProps {
  articles: Article[];
}

export default function FeaturedSlider({ articles }: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, articles.length]);

  const currentArticle = articles[currentIndex];

  const goToPrevious = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const goToNext = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  return (
    <div className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden featured-section group">
      {/* Background Image */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          backgroundImage: `url(${currentArticle.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
        <div className="max-w-2xl">
          {/* Featured Label */}
          <div className="featured-label mb-4">Featured Story</div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {currentArticle.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-100 mb-6 line-clamp-2">{currentArticle.excerpt}</p>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-6 text-sm text-gray-200">
            <span>{currentArticle.author.name}</span>
            <span>•</span>
            <span>{currentArticle.publishedAt.toLocaleDateString()}</span>
            <span>•</span>
            <span>{currentArticle.readTime} min read</span>
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            <Link href={`/article/${currentArticle.slug}`}>
              <a className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                Read lead story →
              </a>
            </Link>
            <a
              href="https://eva.useaima.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              Open eva
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        onMouseEnter={() => setAutoPlay(false)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        onMouseEnter={() => setAutoPlay(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setAutoPlay(false);
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-accent w-8' : 'bg-white/40 w-2 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
