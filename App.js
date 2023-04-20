import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
} from 'react-native';
import axios from 'axios';

const KeyboardAvoidingComponent = ({ searchTerm, setSearchTerm, handleSearch }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <TextInput
            placeholder="Username"
            style={styles.textInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Button title="Cerca" onPress={handleSearch} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showView, setShowView] = useState(true);

  const homebutton = () => {
     setShowView(true);
     setData(null);
  }

  const handleSearch = async () => {
    setError(null);
    try {
      const response = await axios.get(
        `https://api.github.com/users/${searchTerm.toLocaleLowerCase().split(' ').join('')}`
      );
      setData(response.data);
    } catch (err) {
      setError('Utente non trovato!');
    }
    finally{
      setShowView(false);
    }
  };

  return (
    <View style={styles.container}>
      {showView && <View>
        <Text>Inserisci il nome utente GitHub:</Text>
        <KeyboardAvoidingComponent
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />
      </View>}
      {error && <View><Text style={styles.error}>{error}</Text><Button title='torna' onPress={homebutton}/></View>}
      {data && (
        <View style={styles.userData}>
          <Image
            source={{ uri: data.avatar_url }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>Nome utente: {data.login}</Text>
          {data.name && (
            <Text style={styles.name}>Nome completo: {data.name}</Text>
          )}
          {data.bio && <Text style={styles.bio}>Biografia: {data.bio}</Text>}
          <Button title="torna"onPress={homebutton}/>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  userData: {
    marginTop: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  name: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  bio: {
    marginBottom: 5,
  },
  error: {
    color: 'red',
    marginTop: 20,
  }, 
});
