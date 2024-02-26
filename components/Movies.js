import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMovies, removeMovies } from "../reducers/likedMovies";
import styles from "../styles/Movies.module.css";
import { Popover, Button } from "antd";

export default function Movies() {
  const dispatch = useDispatch();
  const likedMovie = useSelector((state) => state.likedMovies.value);
  console.log(likedMovie);
  const [moviesData, setMoviesData] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=0b0d9b619386a2277ab07b9f85318159`
    )
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);

        setMoviesData(data.results);
        //console.log(data.results[0].overview);
      });
  }, []);
  // Fonction pour limiter le nombre de caractères dans une chaîne de caractères
  function limiterCaracteres(texte, limite) {
    if (texte.length > limite) {
      return texte.substring(0, limite) + "...";
    } else {
      return texte;
    }
  }
  // Vérifier si un film est aimé
  const isMovieLiked = (movie) => {
    return likedMovie.includes(movie.title);
  };
  //liked movies

  const handleLikeMovie = (movieTitle) => {
    if (likedMovie.find((movie) => movie === movieTitle)) {
      setLikedMovies(likedMovie.filter((movie) => movie !== movieTitle));
      dispatch(removeMovies(movieTitle)); /* */
      console.log(movieTitle);
    } else {
      setLikedMovies([...likedMovie, movieTitle]);
      dispatch(addMovies(movieTitle));

      console.log(movieTitle);
    }
  };
  return (
    <div>
      <Popover
        title="Liked movies"
        content={likedMovie.map((move, i) => (
          <div key={i} className={styles.likedMoviesContainer}>
            <span>{move}</span>
          </div>
        ))}
        className={styles.popover}
        trigger="click"
      >
        <Button className={styles.buttonPopover}>
          ♥ {likedMovie.length} movie(s)
        </Button>
      </Popover>

      <div className={styles.containerMedia}>
        {moviesData.map((movie) => (
          <div className={styles.card} key={movie.id}>
            <img
              className={styles.image}
              src={`https://image.tmdb.org/t/p/w500//${movie.poster_path}`}
              alt={movie.poster_path}
            />
            <p className={styles.titleArticle}>{movie.title}</p>
            <p className={styles.descriptionArticle}>
              {limiterCaracteres(movie.overview, 250)}
            </p>

            <p>{movie.release_date}</p>
            <span>
              <FontAwesomeIcon
                icon={faHeart}
                onClick={() => handleLikeMovie(movie.title)}
                style={
                  isMovieLiked(movie) ? { color: "red" } : { color: "black" }
                }
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
