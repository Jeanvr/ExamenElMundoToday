import React, { useState } from 'react';
import Home from './pages/Home';
import { Post } from './pages/types';

const App: React.FC = () => {
  const [favorites, setFavorites] = useState<Post[]>([]);

  const handleAddFavorite = (post: Post) => {
    setFavorites((prevFavorites) => [...prevFavorites, post]);
  };

  const handleRemoveFavorite = (post: Post) => {
    setFavorites((prevFavorites) => prevFavorites.filter(fav => fav.id !== post.id));
  };

  return (
    <div>
      <Home 
        onAddFavorite={handleAddFavorite} 
        onRemoveFavorite={handleRemoveFavorite} 
        favorites={favorites} 
      />
      {/* Agrega otros componentes y rutas según sea necesario */}
    </div>
  );
};

export default App;
