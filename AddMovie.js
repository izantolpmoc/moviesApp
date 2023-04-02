import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function AddMovie({navigation}) {
  
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState();
  const [valid, setValid] = useState(false);

  const onNavigate = () => {
    navigation.navigate('MoviesList', {title, director, date, rating});
};

  const onPressSubmit = () => {
    if(!valid) return;

    onNavigate();
    //réinitialise le champ après validation
    setTitle('');
    setDirector('');
    setDate('');
    setValid(false);
    setRating();

    
  };

  //vérifications
  const checkTitle = () => setValid(title.length > 0);
  const checkDirector = () => setValid(director.length > 0);
  const checkDate = () => {
    const parsedDate = parseInt(date, 10);
    setValid(parsedDate.length > 0 && parsedDate <= Date.getFullYear() && parsedDate >= 1900);
}
  const checkRating = () => setValid(rating < 20);
  

  return (
    <View style={styles.container}>      
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        placeholder='Title'
        onChangeText={title => {setTitle(title); checkTitle();}}
      />

      <Text style={styles.label}>Release date (year)</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={date => {setDate(date); checkDate();}}
        keyboardType='number-pad'
        placeholder='Release Date (year)'
      />

      <Text style={styles.label}>Director</Text>
      <TextInput
        style={styles.input}
        value={director}
        placeholder='Director'
        onChangeText={director => {setDirector(director); checkDirector();}}
      />

      <Text style={styles.label}>Rating (/20)</Text>
      <TextInput
        style={styles.input}
        value={rating}
        onChangeText={rating => {setRating(rating); checkRating();}}
        keyboardType='number-pad'
        placeholder='Rating'
      />
      
      <Button
        title='Submit movie'
        onPress={onPressSubmit}
        disabled={!valid}
        color="#841584"
      ></Button>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    margin: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '80%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  }
});
