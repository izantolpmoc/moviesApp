import { useState } from 'react';
import { Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';

export default function AddMovie({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [directorFilter, setDirectorFilter] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [rating, setRating] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (movie) => {
    navigation.navigate('MoviesList', movie);
  }

  const findByTitle = async () => {
    setIsLoading(true);
    // Clear previous searches
    setMovies([]);

    const termQuery = encodeURIComponent(titleFilter);

    try {
      let request = `https://itunes.apple.com/search?term=${termQuery}&entity=movie&limit=100`;
      let response = await fetch(request);
      let json = await response.json();

      for (let movie of json.results) {
        if (!directorFilter || movie.artistName.toLowerCase().includes(directorFilter.toLowerCase())) {
          const releaseDate = new Date(movie.releaseDate);
          setMovies((movies) => [
            ...movies,
            { id: movie.trackId, title: movie.trackName, date: releaseDate.getFullYear(), director: movie.artistName }
          ]);
        }
      }
      console.log(request);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const findByDirector = async () => {
    setIsLoading(true);
    // Clear previous searches
    setMovies([]);

    const termQuery = encodeURIComponent(directorFilter);

    try {
      let request = `https://itunes.apple.com/search?term=${termQuery}&attribute=directorTerm&entity=movie&limit=100`;
      let response = await fetch(request);
      let json = await response.json();

      for (let movie of json.results) {
        if (movie.artistName.toLowerCase().includes(directorFilter.toLowerCase())) {
          if (!titleFilter || movie.trackName.toLowerCase().includes(titleFilter.toLowerCase())) {
            setMovies((movies) => [
              ...movies,
              { id: movie.trackId, title: movie.trackName, date: movie.releaseDate, director: movie.artistName }
            ]);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    directorFilter ? findByDirector() : findByTitle();
  };

  const handleRatingSubmit = () => {
    // Validate the rating input
    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 20) {
      console.log('Invalid rating. Please enter a number between 1 and 20.');
      return;
    }
  
    // Perform necessary actions with the rating
    const updatedMovie = { ...selectedMovie, rating: parsedRating };
    setSelectedMovie(updatedMovie);
    onSubmit(updatedMovie);
  
    // Clear the selected movie and rating after submission
    setSelectedMovie(null);
    setRating('');
  };
  
  

  return (
    <View style={styles.screen}>
      <Text>Find by title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={titleFilter}
        onChangeText={setTitleFilter}
      />
      <Text>Find by director:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter director name"
        value={directorFilter}
        onChangeText={setDirectorFilter}
      />
      <Button title="Search" onPress={handleSearch} />
      <View style={styles.separator} />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {movies.length > 0 && (
            <FlatList
              data={movies}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setSelectedMovie(item)}>
                  <View style={styles.movieContainer}>
                    <Text style={styles.movieTitle}>{item.title} ({item.date})</Text>
                    <Text style={styles.movieInfo}>Director: {item.director}</Text>
                   {item.rating && <Text style={styles.movieInfo}>Rating: {item.rating}/20</Text>}
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
          {movies.length === 0 && <Text>No movie found.</Text>}
        </>
      )}
      {selectedMovie && (
        <Modal visible={selectedMovie !== null} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
            <Text style={styles.modalInfo}>Director: {selectedMovie.director}</Text>
            <Text style={styles.modalInfo}>Rating: {selectedMovie.rating}/20</Text>

            <Text style={styles.ratingLabel}>Rate the movie:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter rating (1-20)"
              value={rating}
              onChangeText={setRating}
              keyboardType="numeric"
            />

            <Button title="Submit Rating" onPress={handleRatingSubmit} />
            <Button title="Close" onPress={() => setSelectedMovie(null)} />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#eee',
    flex: 1,
    padding: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  movieContainer: {
    backgroundColor: '#fff',
    marginBottom: 5,
    padding: 10,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  movieInfo: {
    fontSize: 14,
    marginTop: 5,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInfo: {
    fontSize: 14,
    marginBottom: 5,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  ratingInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
});
