import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [retryInterval, setRetryInterval] = useState(null);

  

  const fetchMoviesHandler = useCallback(async () => {
    setisLoading(true);
    setError(null);
    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong. Retrying...");
      }
      
      const data = await response.json();
      
      const transformedMovies = data.results.map((movieData) => ({
      
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        
      }));
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
      if(retrying) {
        const intervalId = setTimeout(fetchMoviesHandler, 5000);
        setRetryInterval(intervalId);
      }
    }finally{
      setisLoading(false);
    }
    
  },[retrying]);

  useEffect(()=>{
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const handleRetry = () =>{
    setRetrying(true);
  }
  const handleCancelRetry = () =>{
    setRetrying(false);
    if(retryInterval){
      clearTimeout(retryInterval);
      setRetryInterval(null);
    }
  };

  let content = <p>Found no movies.</p>;

  if(movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }else if(error) {
    content = (
      <div>
        <p>{error}</p>
        {retrying ? (
          <button onClick={handleCancelRetry}>Cancel Retry</button>
        ) : (
          <button onClick={handleRetry}>Retry</button>
        )}
      </div>
    )
  }else if(isLoading){
    content = <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;