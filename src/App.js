import React, { useEffect, useState } from "react";

import MovieCard from './MovieCard';

import './App.css';
import SearchIcon from './search.svg';
// API keys -> 4a0da79c
// OMDb API URL ->  http://www.omdbapi.com/?i=tt3896198&apikey=4a0da79c 

const API_URl = "http://www.omdbapi.com?apikey=b6003d8a";

const App = () => {

    useEffect(()=>{
        searchMovies("SpiderMan");
    },[]);

    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState();

    const searchMovies = async (title) => {
        const response = await fetch(`${API_URl}&s=${title}`);
        const data = await response.json();

        setMovies(data.Search);
    }

    return (
        <div className="app">
            <h1>MovieLand</h1>
            <div className="search">
                <input
                    placeholder="Search for movie"
                    value={searchTerm}
                    onChange={(e)=> setSearchTerm(e.target.value)}
                />
                <img 
                    src={SearchIcon} 
                    alt="search"
                    onClick={() => searchMovies(searchTerm)}
                />
            </div>
            {movies?.length > 0 
                ? (
                    <div className="container">
                        {movies.map((movie) => {
                            return <MovieCard movie={movie}/>
                        })}
                        {/* <MovieCard movie1={movie1}/> */}
                    </div>
                ) : (
                    <div className="empty">
                        <h2>No Movie found</h2>
                    </div>
                )
            }
        </div>
    );
}

export default App;