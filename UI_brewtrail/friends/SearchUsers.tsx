import React, { useState, useContext } from 'react';
import { TextInput, View, Text, Button, FlatList } from 'react-native';
import { useFriends } from '../context/FriendsContex';
import { User } from '@/types/types';
import UserListItem from '@/app/userProfile/UserListItem';

const SearchUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { searchResults, handleSearchUsers } = useFriends();

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      await handleSearchUsers(searchTerm.trim());
    }
  };

  return (
    <View>
      <TextInput
        placeholder='Search for users by name...'
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
        }}
        onSubmitEditing={handleSearch}
      />
      <Button
        title='Search'
        onPress={handleSearch}
      />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <UserListItem user={item} />}
      />
    </View>
  );
};

export default SearchUsers;
