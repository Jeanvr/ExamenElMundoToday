import React, { useEffect, useState } from 'react';
import { Post } from './types';
import './Home.css';

interface HomeProps {
  onAddFavorite: (post: Post) => void;
  onRemoveFavorite: (post: Post) => void;
  favorites: Post[];
}

const Home: React.FC<HomeProps> = ({ onAddFavorite, onRemoveFavorite, favorites }) => {
  const [news, setNews] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://www.elmundotoday.com/wp-json/wp/v2/posts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Post[] = await response.json();
        setNews(data);
      } catch (err) {
        setError('Error fetching news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const mediaPromises = news.map(async (post) => {
          const mediaResponse = await fetch(`https://www.elmundotoday.com/wp-json/wp/v2/media/${post.featured_media}`);
          if (!mediaResponse.ok) {
            throw new Error('Network response was not ok');
          }
          const mediaData = await mediaResponse.json();
          return {
            ...post,
            imageUrl: mediaData.media_details.sizes.medium.source_url,
          };
        });

        const newsWithImages = await Promise.all(mediaPromises);
        setNews(newsWithImages);
      } catch (err) {
        console.error('Error fetching media:', err);
        setError('Error fetching media');
      } finally {
        setLoading(false);
      }
    };

    if (news.length > 0) {
      loadImages();
    }
  }, [news]);

  const handleNewsClick = (link: string) => {
    window.open(link, '_blank');
  };

  const handleAddFavorite = (item: Post) => {
    onAddFavorite(item);
  };

  const handleRemoveFavorite = (item: Post) => {
    onRemoveFavorite(item);
  };

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <h1>Examen El Mundo Today</h1>
      <hr className="orange-line" />
      <h2>Últimas noticias</h2>
      <hr className="sub-line" />
      <div className="news-container">
        {news.map((item) => (
          <div key={item.id} className="news-item">
            <div className="news-content" onClick={() => handleNewsClick(item.link)}>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title.rendered}
                  className="news-image"
                  onClick={() => handleAddFavorite(item)}
                />
              )}
              <div className="news-title">{item.title.rendered}</div>
            </div>
            <button className="add-favorite-btn" onClick={() => handleAddFavorite(item)}>Add to Favorites</button>
          </div>
        ))}
      </div>
      <h2>Favoritos</h2>
      <hr className="sub-line" />
      <div className="favorites-container">
        {favorites.map((item) => (
          <div key={item.id} className="news-item">
            <div className="news-content" onClick={() => handleNewsClick(item.link)}>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title.rendered}
                  className="news-image"
                />
              )}
              <div className="news-title">{item.title.rendered}</div>
            </div>
            <button className="remove-favorite-btn" onClick={() => handleRemoveFavorite(item)}>Remove from Favorites</button>
          </div>
        ))}
      </div>
      {showScrollButton && (
        <button className="scroll-to-top-btn" onClick={scrollToTop}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2L3 13h6v7h6v-7h6L12 2z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Home;
