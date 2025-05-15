// styles/chatStyles.js
import { StyleSheet } from 'react-native';

export const getChatStyles = (isPortrait) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F3F8FF',
      paddingHorizontal: 10,
      paddingTop: isPortrait ? 20 : 10,
    },
    title: {
      fontSize: isPortrait ? 24 : 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: isPortrait ? 10 : 5,
      color: '#333',
    },
    backButton: {
      marginLeft: 15,
      marginBottom: 10,
    },
    backText: {
      color: '#2894B0',
      fontWeight: 'bold',
      fontSize: 16,
    },
    messageBubbleLeft: {
      alignSelf: 'flex-start',
      backgroundColor: '#ccc',
      marginVertical: 5,
      padding: 10,
      borderRadius: 10,
      maxWidth: '80%',
    },
    messageBubbleRight: {
      alignSelf: 'flex-end',
      backgroundColor: '#2894B0',
      marginVertical: 5,
      padding: 10,
      borderRadius: 10,
      maxWidth: '80%',
    },
    messageTextLeft: {
      color: '#000',
    },
    messageTextRight: {
      color: '#fff',
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 10,
      borderTopWidth: 1,
      borderColor: '#ddd',
      backgroundColor: '#fff',
    },
    textInput: {
      flex: 1,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 20,
      marginRight: 10,
      fontSize: 16,
    },
    sendButton: {
      justifyContent: 'center',
    },
    sendButtonText: {
      fontWeight: 'bold',
      color: '#2894B0',
      fontSize: 16,
    },
  });
