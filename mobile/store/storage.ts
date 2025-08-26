import * as SecureStore from 'expo-secure-store'
import { Storage } from 'redux-persist'

const secureStorage: Storage = {
    setItem: (key, value) => {
        return SecureStore.setItemAsync(key, value);
    },
    getItem: (key) => {
        return SecureStore.getItemAsync(key);
    },
    removeItem: (key) => {
        return SecureStore.deleteItemAsync(key);
    }
}

export default secureStorage;
