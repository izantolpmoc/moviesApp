import { useIsFocused } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { View, StyleSheet, Text, FlatList,TextInput, Button } from "react-native";

export default function MoviesList({navigation, route}) {
const init_movies = [
    {
        'title': 'Back to the futur',
        'date': 1985,
        'director': 'Robert Zemeckis',
        'rating': 15
    },
    {
        'title': 'Lord of the Rings',
        'director': 'Peter Jackson',
        'date': 2001,
        'rating': 19
    }
];
const [movies, setMovies] = useState(init_movies);
const [filteredMovies, setFilteredMovies] = useState(movies);
const [dateFilter, setDateFilter] = useState('');
const [directorFilter, setDirectorFilter] = useState('');
const addedMovie = route.params;
const isFocused = useIsFocused();

const updateMovies = () => {
    if(addedMovie != null && !movies.includes(addedMovie)) {
        const newMovies = [...movies, addedMovie];
        setMovies(newMovies);
        setFilteredMovies(newMovies);
    }
};

const filterByDirector = (director) => {
    setDirectorFilter(director);
    var filteredMovies = (!!director && director != "")  
                        ? movies.filter(movie => movie.director.toLowerCase().includes(director.toLowerCase()))
                        : movies;

    // take into account current date filter
    if (dateFilter !== '') {
        filteredMovies = filteredMovies.filter(movie => movie.date == dateFilter || movie.date.toString().includes(dateFilter));
    }
    setFilteredMovies(filteredMovies);
};

const filterByDate = (date) => {
    setDateFilter(date);
    var filteredMovies = (!!date && date != "")  
                        ? movies.filter(movie => movie.date == date || movie.date.toString().includes(date))
                        : movies;

    // take into account current director filter
    if (directorFilter !== '') {
        filteredMovies = filteredMovies.filter(movie => movie.director.toLowerCase().includes(directorFilter.toLowerCase()));
    }
    setFilteredMovies(filteredMovies);
};

// update list when tab is displayed
useEffect( () => { 
    if(isFocused) updateMovies(); 
}, [isFocused]);


    return (
        <View style={styles.screen}>
            <Text>Filter by release year:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter release date (year)"
                onChangeText={text => filterByDate(text)}
            />
            <Text>Filter by director:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter director name"
                onChangeText={text => filterByDirector(text)}
            />
            <View style={styles.separator} />
            {filteredMovies.length > 0 && 
                <FlatList
                data={filteredMovies}
                keyExtractor={item => item.title}
                renderItem={({item}) => 
                    <View style={styles.movieContainer}>
                    <Text style={styles.movieTitle}>{item.title} ({item.date})</Text>
                    <Text style={styles.movieInfo}>Director: {item.director}</Text>
                    <Text style={styles.movieInfo}>Rating: {item.rating}/20</Text>
                    </View>
                }
                />
            }
            {filteredMovies.length == 0 && <Text>No movie found.</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    screen: {
        backgroundColor: '#eee',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
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
});