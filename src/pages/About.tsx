import React from 'react';
import { Post } from './types'; // Ajusta la ruta según la ubicación real
import './About.css'; // Importa tus estilos CSS para About

interface AboutProps {
  favorites: Post[];
  onRemoveFavorite: (id: number) => void;
}

const About: React.FC<AboutProps> = ({ favorites, onRemoveFavorite }) => {
  const handleRemoveFavorite = (id: number) => {
    onRemoveFavorite(id);
  };

  return (
    <div className="container">
      <h1>Favorite News</h1>
      <div className="favorites-container">
        {favorites.length === 0 ? (
          <div>No favorites yet.</div>
        ) : (
          favorites.map((item) => (
            <div key={item.id} className="favorite-item">
              <h2>{item.title.rendered}</h2>
              {item.imageUrl && <img src={item.imageUrl} alt={item.title.rendered} className="favorite-image" />}
              <button className="remove-favorite-btn" onClick={() => handleRemoveFavorite(item.id)}>Remove from Favorites</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default About;

