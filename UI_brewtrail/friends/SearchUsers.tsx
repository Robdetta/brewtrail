import React, { useState } from 'react';
import { TextInput, View, Button, FlatList } from 'react-native';
import { useFriends } from '../context/FriendsContex';
import UserListItem from '@/app/userProfile/UserListItem';
import { useAuth } from '@/context/auth';

const SearchUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { searchResults, handleSearchUsers } = useFriends();
  const { userProfile } = useAuth();

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      await handleSearchUsers(searchTerm.trim());
    }
  };

  const filteredResults = searchResults.filter(
    (user) => user.id !== userProfile.id,
  );

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
        data={filteredResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <UserListItem user={item} />}
      />
    </View>
  );
};

export default SearchUsers;
