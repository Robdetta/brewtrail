import React, { useState } from 'react';
import {
  TextInput,
  View,
  Button,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';
import { useFriends } from '../context/FriendsContex';
import UserListItem from '@/app/userProfile/UserListItem';
import { useAuth } from '@/context/auth';

const SearchUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { searchResults, handleSearchUsers } = useFriends();
  const { userProfile } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const validateInput = (input: string): boolean => {
    if (input.length < 3) {
      setErrorMessage('Please enter at least 3 characters.');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(input)) {
      setErrorMessage(
        'Please use only alphanumeric characters and underscores.',
      );
      return false;
    }
    setErrorMessage(''); // Clear any previous error messages
    return true;
  };

  const handleSearch = async () => {
    const trimmedSearchTerm = searchTerm.trim();
    if (validateInput(trimmedSearchTerm)) {
      await handleSearchUsers(trimmedSearchTerm);
    }
  };

  const filteredResults = searchResults.filter(
    (user) => user.id !== userProfile.id,
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Search for users by name...'
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.input}
        onSubmitEditing={handleSearch}
      />
      <Button
        title='Search'
        onPress={handleSearch}
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <UserListItem user={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '50%',
    alignSelf: 'center',
  },
  buttonContainer: {
    width: '50%',
    alignSelf: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 5,
    marginBottom: 5,
  },
});

export default SearchUsers;
