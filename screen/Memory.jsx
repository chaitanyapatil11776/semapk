// // // // // // import React, { useState, useRef } from 'react';
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   Image,
// // // // // //   ScrollView,
// // // // // //   TouchableOpacity,
// // // // // //   TextInput,
// // // // // //   StyleSheet,
// // // // // //   FlatList,
// // // // // //   Animated,
// // // // // //   Dimensions,
// // // // // //   Alert,
// // // // // //   ActivityIndicator,
// // // // // //   StatusBar,
// // // // // //   Share,
// // // // // //   KeyboardAvoidingView,
// // // // // //   Platform,
// // // // // // } from 'react-native';

// // // // // // import { LinearGradient } from 'expo-linear-gradient';
// // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // import * as ImagePicker from 'expo-image-picker';
// // // // // // import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

// // // // // // const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// // // // // // const SERVER_URL = 'http://10.90.216.30:3000';

// // // // // // export default function MemoryScreen({ navigation }) {
// // // // // //   const [step, setStep] = useState('input'); // 'input' | 'loading' | 'result'
// // // // // //   const [moments, setMoments] = useState([]); // { id, uri, base64, note }
// // // // // //   const [loadingText, setLoadingText] = useState('');
// // // // // //   const [finalMemory, setFinalMemory] = useState(null);
  
// // // // // //   const fadeAnim = useRef(new Animated.Value(0)).current;

// // // // // //   // ======================== ADD PHOTO ========================
// // // // // //   const addPhoto = async () => {
// // // // // //     if (moments.length >= 6) {
// // // // // //       Alert.alert("Limit Reached", "You can add a maximum of 6 moments.");
// // // // // //       return;
// // // // // //     }
// // // // // //     try {
// // // // // //       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// // // // // //       if (status !== 'granted') return Alert.alert('Permission Needed');
      
// // // // // //       const result = await ImagePicker.launchImageLibraryAsync({
// // // // // //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
// // // // // //         quality: 0.6, // Lower quality for faster upload of 6 images
// // // // // //         base64: true,
// // // // // //       });

// // // // // //       if (!result.canceled && result.assets[0]) {
// // // // // //         setMoments(prev => [...prev, {
// // // // // //           id: Date.now().toString(),
// // // // // //           uri: result.assets[0].uri,
// // // // // //           base64: result.assets[0].base64,
// // // // // //           note: ''
// // // // // //         }]);
// // // // // //       }
// // // // // //     } catch (err) {
// // // // // //       Alert.alert('Error', 'Failed to pick image');
// // // // // //     }
// // // // // //   };

// // // // // //   const removePhoto = (id) => {
// // // // // //     setMoments(prev => prev.filter(m => m.id !== id));
// // // // // //   };

// // // // // //   const updateNote = (id, text) => {
// // // // // //     setMoments(prev => prev.map(m => m.id === id ? { ...m, note: text } : m));
// // // // // //   };

// // // // // //   // ======================== GENERATE MEMORY ========================
// // // // // //   const generateMemory = async () => {
// // // // // //     if (moments.length < 2) {
// // // // // //       return Alert.alert("Need More", "Please add at least 2 photos to build a trip memory.");
// // // // // //     }

// // // // // //     const emptyNotes = moments.filter(m => m.note.trim() === '');
// // // // // //     if (emptyNotes.length > 0) {
// // // // // //       Alert.alert("Add Details", "Please write a small note for every photo before generating.");
// // // // // //       return;
// // // // // //     }

// // // // // //     setStep('loading');
// // // // // //     setLoadingText('📸 Analyzing your travel moments...');

// // // // // //     try {
// // // // // //       setLoadingText('🧠 Reading your personal notes...');

// // // // // //       const payload = moments.map(m => ({
// // // // // //         image_base64: m.base64,
// // // // // //         user_note: m.note
// // // // // //       }));

// // // // // //       const response = await fetch(`${SERVER_URL}/api/travel-memory-builder`, {
// // // // // //         method: 'POST',
// // // // // //         headers: { 'Content-Type': 'application/json' },
// // // // // //         body: JSON.stringify({ moments: payload }),
// // // // // //       });

// // // // // //       const data = await response.json();
// // // // // //       if (!data.success) throw new Error(data.error);

// // // // // //       setLoadingText('✨ Writing your travel story...');
      
// // // // // //       // Small delay for UX feel
// // // // // //       await new Promise(resolve => setTimeout(resolve, 1500));

// // // // // //       setFinalMemory(data.data);
// // // // // //       setStep('result');
// // // // // //       Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
      
// // // // // //     } catch (err) {
// // // // // //       console.error(err);
// // // // // //       Alert.alert("Error", err.message);
// // // // // //       setStep('input');
// // // // // //     }
// // // // // //   };

// // // // // //   // ======================== SHARE ========================
// // // // // //   const shareStory = async () => {
// // // // // //     if (!finalMemory) return;
// // // // // //     const captions = finalMemory.timeline.map(t => `• ${t.social_caption}`).join('\n');
// // // // // //     await Share.share({
// // // // // //       message: `✈️ ${finalMemory.trip_title}\n\n${finalMemory.travel_story}\n\nCaptions for your photos:\n${captions}\n\n#TravioX`
// // // // // //     });
// // // // // //   };

// // // // // //   // ======================== RENDER: INPUT SCREEN ========================
// // // // // //   const renderInput = () => (
// // // // // //     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
// // // // // //       <FlatList
// // // // // //         data={moments}
// // // // // //         keyExtractor={item => item.id}
// // // // // //         contentContainerStyle={styles.listContainer}
// // // // // //         ListHeaderComponent={
// // // // // //           <>
// // // // // //             <Text style={styles.mainTitle}>Build Your Trip Memory</Text>
// // // // // //             <Text style={styles.subtitle}>Add up to 6 photos and write a small detail about each moment.</Text>
            
// // // // // //             <TouchableOpacity style={styles.addPhotoBtn} onPress={addPhoto} activeOpacity={0.8}>
// // // // // //               <LinearGradient colors={['#667eea', '#764ba2']} style={styles.addPhotoGradient}>
// // // // // //                 <Ionicons name="add-circle-outline" size={24} color="#fff" />
// // // // // //                 <Text style={styles.addPhotoText}>Add Moment ({moments.length}/6)</Text>
// // // // // //               </LinearGradient>
// // // // // //             </TouchableOpacity>
// // // // // //           </>
// // // // // //         }
// // // // // //         ListFooterComponent={
// // // // // //           moments.length >= 2 ? (
// // // // // //             <TouchableOpacity style={styles.generateBtn} onPress={generateMemory}>
// // // // // //               <Text style={styles.generateBtnText}>Generate Travel Story ✨</Text>
// // // // // //             </TouchableOpacity>
// // // // // //           ) : null
// // // // // //         }
// // // // // //         renderItem={({ item, index }) => (
// // // // // //           <View style={styles.momentCard}>
// // // // // //             <Image source={{ uri: item.uri }} style={styles.momentImage} />
// // // // // //             <View style={styles.momentInputWrapper}>
// // // // // //               <View style={styles.momentHeader}>
// // // // // //                 <Text style={styles.momentLabel}>Moment {index + 1}</Text>
// // // // // //                 <TouchableOpacity onPress={() => removePhoto(item.id)}>
// // // // // //                   <Ionicons name="close-circle" size={22} color="#f5576c" />
// // // // // //                 </TouchableOpacity>
// // // // // //               </View>
// // // // // //               <TextInput
// // // // // //                 style={styles.momentInput}
// // // // // //                 placeholder="e.g., We ate the best street food here at sunset..."
// // // // // //                 placeholderTextColor="#888"
// // // // // //                 multiline
// // // // // //                 value={item.note}
// // // // // //                 onChangeText={(text) => updateNote(item.id, text)}
// // // // // //               />
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         )}
// // // // // //       />
// // // // // //     </KeyboardAvoidingView>
// // // // // //   );

// // // // // //   // ======================== RENDER: LOADING ========================
// // // // // //   const renderLoading = () => (
// // // // // //     <View style={styles.loadingContainer}>
// // // // // //       <ActivityIndicator size="large" color="#667eea" />
// // // // // //       <Text style={styles.loadingText}>{loadingText}</Text>
// // // // // //     </View>
// // // // // //   );

// // // // // //   // ======================== RENDER: RESULT STORY ========================
// // // // // //   const renderResult = () => (
// // // // // //     <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
// // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // //         {/* Hero Section */}
// // // // // //         <View style={styles.heroSection}>
// // // // // //           <Text style={styles.heroTitle}>{finalMemory.trip_title}</Text>
// // // // // //           <View style={styles.tagRow}>
// // // // // //             {finalMemory.tags?.map((tag, i) => (
// // // // // //               <View key={i} style={styles.heroTag}>
// // // // // //                 <Text style={styles.heroTagText}>#{tag}</Text>
// // // // // //               </View>
// // // // // //             ))}
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         {/* Story */}
// // // // // //         <View style={styles.storyContainer}>
// // // // // //           <FontAwesome5 name="feather-alt" size={18} color="#667eea" style={{ marginBottom: 10 }} />
// // // // // //           <Text style={styles.storyText}>{finalMemory.travel_story}</Text>
// // // // // //         </View>

// // // // // //         {/* Timeline of Moments */}
// // // // // //         <View style={styles.timelineContainer}>
// // // // // //           <Text style={styles.timelineTitle}>Your Moments & Captions</Text>
          
// // // // // //           {finalMemory.timeline?.map((item, index) => (
// // // // // //             <View key={index} style={styles.timelineCard}>
// // // // // //               <Image source={{ uri: moments[index]?.uri }} style={styles.timelineImage} />
// // // // // //               <View style={styles.timelineContent}>
// // // // // //                 <View style={styles.timelineHeader}>
// // // // // //                   <Text style={styles.timelineEmoji}>{item.mood_emoji}</Text>
// // // // // //                   <Text style={styles.timelineMood}>{item.mood}</Text>
// // // // // //                 </View>
// // // // // //                 <Text style={styles.timelineNote}>💡 "{item.user_note}"</Text>
// // // // // //                 <View style={styles.captionBox}>
// // // // // //                   <Text style={styles.captionLabel}>Instagram Caption:</Text>
// // // // // //                   <Text style={styles.captionText}>{item.social_caption}</Text>
// // // // // //                   <TouchableOpacity onPress={() => Share.share({ message: item.social_caption })} style={styles.copySmallBtn}>
// // // // // //                     <Ionicons name="share-social" size={14} color="#667eea" />
// // // // // //                   </TouchableOpacity>
// // // // // //                 </View>
// // // // // //               </View>
// // // // // //             </View>
// // // // // //           ))}
// // // // // //         </View>

// // // // // //         {/* Actions */}
// // // // // //         <View style={styles.resultActions}>
// // // // // //           <TouchableOpacity style={styles.shareFullBtn} onPress={shareStory}>
// // // // // //             <LinearGradient colors={['#667eea', '#764ba2']} style={styles.shareFullGradient}>
// // // // // //               <Ionicons name="share-social-outline" size={20} color="#fff" />
// // // // // //               <Text style={styles.shareFullText}>Share Full Story</Text>
// // // // // //             </LinearGradient>
// // // // // //           </TouchableOpacity>
          
// // // // // //           <TouchableOpacity style={styles.newTripBtn} onPress={() => {
// // // // // //             setStep('input');
// // // // // //             setMoments([]);
// // // // // //             setFinalMemory(null);
// // // // // //             fadeAnim.setValue(0);
// // // // // //           }}>
// // // // // //             <Text style={styles.newTripText}>Create New Trip</Text>
// // // // // //           </TouchableOpacity>
// // // // // //         </View>
// // // // // //         <View style={{ height: 40 }} />
// // // // // //       </ScrollView>
// // // // // //     </Animated.View>
// // // // // //   );

// // // // // //   // ======================== MAIN RENDER ========================
// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.screen}>
// // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#f8f9ff" />
      
// // // // // //       <View style={styles.header}>
// // // // // //         <TouchableOpacity onPress={() => step === 'result' ? setStep('input') : navigation.goBack()}>
// // // // // //           <Ionicons name={step === 'result' ? "arrow-back" : "close"} size={24} color="#333" />
// // // // // //         </TouchableOpacity>
// // // // // //         <Text style={styles.headerTitle}>
// // // // // //           {step === 'input' ? 'Trip Memory' : step === 'loading' ? 'Creating...' : 'Your Story'}
// // // // // //         </Text>
// // // // // //         <View style={{ width: 24 }} />
// // // // // //       </View>

// // // // // //       {step === 'input' ? renderInput() : step === 'loading' ? renderLoading() : renderResult()}
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // }

// // // // // // // ======================== STYLES ========================
// // // // // // const styles = StyleSheet.create({
// // // // // //   screen: { flex: 1, backgroundColor: '#f8f9ff' },
// // // // // //   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
// // // // // //   headerTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },

// // // // // //   // Input Step
// // // // // //   listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
// // // // // //   mainTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a2e', marginTop: 10, marginBottom: 8 },
// // // // // //   subtitle: { fontSize: 15, color: '#888', marginBottom: 24, lineHeight: 22 },
// // // // // //   addPhotoBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
// // // // // //   addPhotoGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
// // // // // //   addPhotoText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  
// // // // // //   momentCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eee', flexDirection: 'row' },
// // // // // //   momentImage: { width: 110, height: 130 },
// // // // // //   momentInputWrapper: { flex: 1, padding: 12, justifyContent: 'center' },
// // // // // //   momentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
// // // // // //   momentLabel: { fontSize: 14, fontWeight: '700', color: '#667eea' },
// // // // // //   momentInput: { fontSize: 13, color: '#333', minHeight: 60, textAlignVertical: 'top', lineHeight: 18 },

// // // // // //   generateBtn: { backgroundColor: '#1a1a2e', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 10, marginBottom: 20 },
// // // // // //   generateBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },

// // // // // //   // Loading Step
// // // // // //   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// // // // // //   loadingText: { fontSize: 16, color: '#666', marginTop: 20, fontWeight: '500' },

// // // // // //   // Result Step
// // // // // //   heroSection: { padding: 20, alignItems: 'center' },
// // // // // //   heroTitle: { fontSize: 28, fontWeight: '800', color: '#1a1a2e', textAlign: 'center', marginBottom: 16, lineHeight: 36 },
// // // // // //   tagRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
// // // // // //   heroTag: { backgroundColor: 'rgba(102, 126, 234, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
// // // // // //   heroTagText: { fontSize: 13, color: '#667eea', fontWeight: '600' },

// // // // // //   storyContainer: { backgroundColor: '#fff', marginHorizontal: 20, padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#eee', marginBottom: 24 },
// // // // // //   storyText: { fontSize: 16, color: '#444', lineHeight: 28, fontStyle: 'italic' },

// // // // // //   timelineContainer: { paddingHorizontal: 20 },
// // // // // //   timelineTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 16 },
  
// // // // // //   timelineCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
// // // // // //   timelineImage: { width: 100, height: '100%', minHeight: 180 },
// // // // // //   timelineContent: { flex: 1, padding: 16, justifyContent: 'center' },
// // // // // //   timelineHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
// // // // // //   timelineEmoji: { fontSize: 20 },
// // // // // //   timelineMood: { fontSize: 14, fontWeight: '700', color: '#667eea', textTransform: 'uppercase' },
// // // // // //   timelineNote: { fontSize: 13, color: '#666', marginBottom: 12, fontStyle: 'italic', lineHeight: 18 },
  
// // // // // //   captionBox: { backgroundColor: '#f8f9ff', padding: 12, borderRadius: 12, position: 'relative' },
// // // // // //   captionLabel: { fontSize: 11, color: '#999', fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
// // // // // //   captionText: { fontSize: 14, color: '#333, fontWeight: '600', lineHeight: 20, paddingRight: 24 },
// // // // // //   copySmallBtn: { position: 'absolute', top: 12, right: 12 },

// // // // // //   resultActions: { paddingHorizontal: 20, paddingVertical: 20, gap: 12 },
// // // // // //   shareFullBtn: { borderRadius: 16, overflow: 'hidden' },
// // // // // //   shareFullGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
// // // // // //   shareFullText: { fontSize: 16, fontWeight: '600', color: '#fff' },
// // // // // //   newTripBtn: { paddingVertical: 14, alignItems: 'center' },
// // // // // //   newTripText: { fontSize: 16, fontWeight: '600', color: '#f5576c' },
// // // // // // });













// // // // // import React, { useState, useRef } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   Image,
// // // // //   ScrollView,
// // // // //   TouchableOpacity,
// // // // //   TextInput,
// // // // //   StyleSheet,
// // // // //   FlatList,
// // // // //   Animated,
// // // // //   Alert,
// // // // //   ActivityIndicator,
// // // // //   StatusBar,
// // // // //   Share,
// // // // //   KeyboardAvoidingView,
// // // // //   Platform,
// // // // // } from 'react-native';

// // // // // import { LinearGradient } from 'expo-linear-gradient';
// // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // import * as ImagePicker from 'expo-image-picker';
// // // // // import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

// // // // // const SERVER_URL = 'http://10.90.216.30:3000';

// // // // // export default function MemoryScreen({ navigation }) {
// // // // //   const [step, setStep] = useState('input');
// // // // //   const [moments, setMoments] = useState([]);
// // // // //   const [loadingText, setLoadingText] = useState('');
// // // // //   const [finalMemory, setFinalMemory] = useState(null);
// // // // //   const fadeAnim = useRef(new Animated.Value(0)).current;

// // // // //   const addPhoto = async () => {
// // // // //     if (moments.length >= 6) {
// // // // //       Alert.alert("Limit Reached", "Maximum 6 moments allowed.");
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       // Request permission
// // // // //       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
// // // // //       if (status === 'denied') {
// // // // //         Alert.alert(
// // // // //           "Permission Denied",
// // // // //           "Please go to Settings > Apps > TravioX > Permissions and enable Gallery access.",
// // // // //           [{ text: "OK" }]
// // // // //         );
// // // // //         return;
// // // // //       }
      
// // // // //       if (status !== 'granted') {
// // // // //         Alert.alert("Permission Needed", "Gallery access is required to select photos.");
// // // // //         return;
// // // // //       }

// // // // //       // Launch picker
// // // // //       const result = await ImagePicker.launchImageLibraryAsync({
// // // // //         mediaTypes: ['images'], // Alternative syntax
// // // // //         quality: 0.6,
// // // // //         base64: true,
// // // // //         allowsEditing: false,
// // // // //       });

// // // // //       if (result.canceled) {
// // // // //         console.log("User cancelled picker");
// // // // //         return;
// // // // //       }

// // // // //       if (result.assets && result.assets[0]) {
// // // // //         const asset = result.assets[0];
// // // // //         setMoments(prev => [...prev, {
// // // // //           id: Date.now().toString(),
// // // // //           uri: asset.uri,
// // // // //           base64: asset.base64,
// // // // //           note: ''
// // // // //         }]);
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error("ImagePicker Error:", error);
// // // // //       Alert.alert("Error", `Failed to open gallery: ${error.message}`);
// // // // //     }
// // // // //   };

// // // // //   const removePhoto = (id) => {
// // // // //     setMoments(prev => prev.filter(m => m.id !== id));
// // // // //   };

// // // // //   const updateNote = (id, text) => {
// // // // //     setMoments(prev => prev.map(m => m.id === id ? { ...m, note: text } : m));
// // // // //   };

// // // // //   const generateMemory = async () => {
// // // // //     if (moments.length < 2) {
// // // // //       return Alert.alert("Need More", "Add at least 2 photos.");
// // // // //     }

// // // // //     const emptyNotes = moments.filter(m => m.note.trim() === '');
// // // // //     if (emptyNotes.length > 0) {
// // // // //       Alert.alert("Add Details", "Write a note for every photo.");
// // // // //       return;
// // // // //     }

// // // // //     setStep('loading');
// // // // //     setLoadingText('📸 Analyzing your travel moments...');

// // // // //     try {
// // // // //       setLoadingText('🧠 Reading your personal notes...');

// // // // //       const payload = moments.map(m => ({
// // // // //         image_base64: m.base64,
// // // // //         user_note: m.note
// // // // //       }));

// // // // //       const response = await fetch(`${SERVER_URL}/api/travel-memory-builder`, {
// // // // //         method: 'POST',
// // // // //         headers: { 'Content-Type': 'application/json' },
// // // // //         body: JSON.stringify({ moments: payload }),
// // // // //       });

// // // // //       const data = await response.json();
// // // // //       if (!data.success) throw new Error(data.error);

// // // // //       setLoadingText('✨ Writing your travel story...');
// // // // //       await new Promise(resolve => setTimeout(resolve, 1500));

// // // // //       setFinalMemory(data.data);
// // // // //       setStep('result');
// // // // //       Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
// // // // //     } catch (err) {
// // // // //       console.error(err);
// // // // //       Alert.alert("Error", err.message);
// // // // //       setStep('input');
// // // // //     }
// // // // //   };

// // // // //   const shareStory = async () => {
// // // // //     if (!finalMemory) return;
// // // // //     const captions = finalMemory.timeline.map(t => `• ${t.social_caption}`).join('\n');
// // // // //     await Share.share({
// // // // //       message: `✈️ ${finalMemory.trip_title}\n\n${finalMemory.travel_story}\n\nCaptions:\n${captions}\n\n#TravioX`
// // // // //     });
// // // // //   };

// // // // //   const renderInput = () => (
// // // // //     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
// // // // //       <FlatList
// // // // //         data={moments}
// // // // //         keyExtractor={item => item.id}
// // // // //         contentContainerStyle={styles.listContainer}
// // // // //         ListHeaderComponent={
// // // // //           <>
// // // // //             <Text style={styles.mainTitle}>Build Your Trip Memory</Text>
// // // // //             <Text style={styles.subtitle}>Add up to 6 photos and write a small detail about each moment.</Text>
// // // // //             <TouchableOpacity style={styles.addPhotoBtn} onPress={addPhoto} activeOpacity={0.8}>
// // // // //               <LinearGradient colors={['#667eea', '#764ba2']} style={styles.addPhotoGradient}>
// // // // //                 <Ionicons name="add-circle-outline" size={24} color="#fff" />
// // // // //                 <Text style={styles.addPhotoText}>Add Moment ({moments.length}/6)</Text>
// // // // //               </LinearGradient>
// // // // //             </TouchableOpacity>
// // // // //           </>
// // // // //         }
// // // // //         ListFooterComponent={
// // // // //           moments.length >= 2 ? (
// // // // //             <TouchableOpacity style={styles.generateBtn} onPress={generateMemory}>
// // // // //               <Text style={styles.generateBtnText}>Generate Travel Story ✨</Text>
// // // // //             </TouchableOpacity>
// // // // //           ) : null
// // // // //         }
// // // // //         renderItem={({ item, index }) => (
// // // // //           <View style={styles.momentCard}>
// // // // //             <Image source={{ uri: item.uri }} style={styles.momentImage} />
// // // // //             <View style={styles.momentInputWrapper}>
// // // // //               <View style={styles.momentHeader}>
// // // // //                 <Text style={styles.momentLabel}>Moment {index + 1}</Text>
// // // // //                 <TouchableOpacity onPress={() => removePhoto(item.id)}>
// // // // //                   <Ionicons name="close-circle" size={22} color="#f5576c" />
// // // // //                 </TouchableOpacity>
// // // // //               </View>
// // // // //               <TextInput
// // // // //                 style={styles.momentInput}
// // // // //                 placeholder="e.g., We ate the best street food here..."
// // // // //                 placeholderTextColor="#888"
// // // // //                 multiline
// // // // //                 value={item.note}
// // // // //                 onChangeText={(text) => updateNote(item.id, text)}
// // // // //               />
// // // // //             </View>
// // // // //           </View>
// // // // //         )}
// // // // //       />
// // // // //     </KeyboardAvoidingView>
// // // // //   );

// // // // //   const renderLoading = () => (
// // // // //     <View style={styles.loadingContainer}>
// // // // //       <ActivityIndicator size="large" color="#667eea" />
// // // // //       <Text style={styles.loadingText}>{loadingText}</Text>
// // // // //     </View>
// // // // //   );

// // // // //   const renderResult = () => (
// // // // //     <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
// // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // //         <View style={styles.heroSection}>
// // // // //           <Text style={styles.heroTitle}>{finalMemory.trip_title}</Text>
// // // // //           <View style={styles.tagRow}>
// // // // //             {finalMemory.tags?.map((tag, i) => (
// // // // //               <View key={i} style={styles.heroTag}>
// // // // //                 <Text style={styles.heroTagText}>#{tag}</Text>
// // // // //               </View>
// // // // //             ))}
// // // // //           </View>
// // // // //         </View>

// // // // //         <View style={styles.storyContainer}>
// // // // //           <FontAwesome5 name="feather-alt" size={18} color="#667eea" style={{ marginBottom: 10 }} />
// // // // //           <Text style={styles.storyText}>{finalMemory.travel_story}</Text>
// // // // //         </View>

// // // // //         <View style={styles.timelineContainer}>
// // // // //           <Text style={styles.timelineTitle}>Your Moments & Captions</Text>
// // // // //           {finalMemory.timeline?.map((item, index) => (
// // // // //             <View key={index} style={styles.timelineCard}>
// // // // //               <Image source={{ uri: moments[index]?.uri }} style={styles.timelineImage} />
// // // // //               <View style={styles.timelineContent}>
// // // // //                 <View style={styles.timelineHeader}>
// // // // //                   <Text style={styles.timelineEmoji}>{item.mood_emoji}</Text>
// // // // //                   <Text style={styles.timelineMood}>{item.mood}</Text>
// // // // //                 </View>
// // // // //                 <Text style={styles.timelineNote}>💡 "{item.user_note}"</Text>
// // // // //                 <View style={styles.captionBox}>
// // // // //                   <Text style={styles.captionLabel}>Instagram Caption:</Text>
// // // // //                   <Text style={styles.captionText}>{item.social_caption}</Text>
// // // // //                   <TouchableOpacity onPress={() => Share.share({ message: item.social_caption })} style={styles.copySmallBtn}>
// // // // //                     <Ionicons name="share-social" size={14} color="#667eea" />
// // // // //                   </TouchableOpacity>
// // // // //                 </View>
// // // // //               </View>
// // // // //             </View>
// // // // //           ))}
// // // // //         </View>

// // // // //         <View style={styles.resultActions}>
// // // // //           <TouchableOpacity style={styles.shareFullBtn} onPress={shareStory}>
// // // // //             <LinearGradient colors={['#667eea', '#764ba2']} style={styles.shareFullGradient}>
// // // // //               <Ionicons name="share-social-outline" size={20} color="#fff" />
// // // // //               <Text style={styles.shareFullText}>Share Full Story</Text>
// // // // //             </LinearGradient>
// // // // //           </TouchableOpacity>
// // // // //           <TouchableOpacity style={styles.newTripBtn} onPress={() => {
// // // // //             setStep('input');
// // // // //             setMoments([]);
// // // // //             setFinalMemory(null);
// // // // //             fadeAnim.setValue(0);
// // // // //           }}>
// // // // //             <Text style={styles.newTripText}>Create New Trip</Text>
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //         <View style={{ height: 40 }} />
// // // // //       </ScrollView>
// // // // //     </Animated.View>
// // // // //   );

// // // // //   return (
// // // // //     <SafeAreaView style={styles.screen}>
// // // // //       <StatusBar barStyle="dark-content" backgroundColor="#f8f9ff" />
// // // // //       <View style={styles.header}>
// // // // //         <TouchableOpacity onPress={() => step === 'result' ? setStep('input') : navigation.goBack()}>
// // // // //           <Ionicons name={step === 'result' ? "arrow-back" : "close"} size={24} color="#333" />
// // // // //         </TouchableOpacity>
// // // // //         <Text style={styles.headerTitle}>
// // // // //           {step === 'input' ? 'Trip Memory' : step === 'loading' ? 'Creating...' : 'Your Story'}
// // // // //         </Text>
// // // // //         <View style={{ width: 24 }} />
// // // // //       </View>
// // // // //       {step === 'input' ? renderInput() : step === 'loading' ? renderLoading() : renderResult()}
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   screen: { flex: 1, backgroundColor: '#f8f9ff' },
// // // // //   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
// // // // //   headerTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
// // // // //   listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
// // // // //   mainTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a2e', marginTop: 10, marginBottom: 8 },
// // // // //   subtitle: { fontSize: 15, color: '#888', marginBottom: 24, lineHeight: 22 },
// // // // //   addPhotoBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
// // // // //   addPhotoGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
// // // // //   addPhotoText: { fontSize: 16, fontWeight: '600', color: '#fff' },
// // // // //   momentCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eee', flexDirection: 'row' },
// // // // //   momentImage: { width: 110, height: 130 },
// // // // //   momentInputWrapper: { flex: 1, padding: 12, justifyContent: 'center' },
// // // // //   momentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
// // // // //   momentLabel: { fontSize: 14, fontWeight: '700', color: '#667eea' },
// // // // //   momentInput: { fontSize: 13, color: '#333', minHeight: 60, textAlignVertical: 'top', lineHeight: 18 },
// // // // //   generateBtn: { backgroundColor: '#1a1a2e', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 10, marginBottom: 20 },
// // // // //   generateBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
// // // // //   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// // // // //   loadingText: { fontSize: 16, color: '#666', marginTop: 20, fontWeight: '500' },
// // // // //   heroSection: { padding: 20, alignItems: 'center' },
// // // // //   heroTitle: { fontSize: 28, fontWeight: '800', color: '#1a1a2e', textAlign: 'center', marginBottom: 16, lineHeight: 36 },
// // // // //   tagRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
// // // // //   heroTag: { backgroundColor: 'rgba(102, 126, 234, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
// // // // //   heroTagText: { fontSize: 13, color: '#667eea', fontWeight: '600' },
// // // // //   storyContainer: { backgroundColor: '#fff', marginHorizontal: 20, padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#eee', marginBottom: 24 },
// // // // //   storyText: { fontSize: 16, color: '#444', lineHeight: 28, fontStyle: 'italic' },
// // // // //   timelineContainer: { paddingHorizontal: 20 },
// // // // //   timelineTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 16 },
// // // // //   timelineCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
// // // // //   timelineImage: { width: 100, height: '100%', minHeight: 180 },
// // // // //   timelineContent: { flex: 1, padding: 16, justifyContent: 'center' },
// // // // //   timelineHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
// // // // //   timelineEmoji: { fontSize: 20 },
// // // // //   timelineMood: { fontSize: 14, fontWeight: '700', color: '#667eea', textTransform: 'uppercase' },
// // // // //   timelineNote: { fontSize: 13, color: '#666', marginBottom: 12, fontStyle: 'italic', lineHeight: 18 },
// // // // //   captionBox: { backgroundColor: '#f8f9ff', padding: 12, borderRadius: 12, position: 'relative' },
// // // // //   captionLabel: { fontSize: 11, color: '#999', fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
// // // // //   captionText: { fontSize: 14, color: '#333', fontWeight: '600', lineHeight: 20, paddingRight: 24 },
// // // // //   copySmallBtn: { position: 'absolute', top: 12, right: 12 },
// // // // //   resultActions: { paddingHorizontal: 20, paddingVertical: 20, gap: 12 },
// // // // //   shareFullBtn: { borderRadius: 16, overflow: 'hidden' },
// // // // //   shareFullGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
// // // // //   shareFullText: { fontSize: 16, fontWeight: '600', color: '#fff' },
// // // // //   newTripBtn: { paddingVertical: 14, alignItems: 'center' },
// // // // //   newTripText: { fontSize: 16, fontWeight: '600', color: '#f5576c' },
// // // // // });








// // // // // new 4
// // // // import React, { useState, useRef } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   Image,
// // // //   ScrollView,
// // // //   TouchableOpacity,
// // // //   TextInput,
// // // //   StyleSheet,
// // // //   FlatList,
// // // //   Animated,
// // // //   Alert,
// // // //   ActivityIndicator,
// // // //   StatusBar,
// // // //   Share,
// // // //   KeyboardAvoidingView,
// // // //   Platform,
// // // // } from 'react-native';

// // // // import { LinearGradient } from 'expo-linear-gradient';
// // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // import * as ImagePicker from 'expo-image-picker';
// // // // import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
// // // // import * as Print from 'expo-print';
// // // // import * as Sharing from 'expo-sharing';

// // // // const SERVER_URL = 'http://10.90.216.30:3000';

// // // // export default function MemoryScreen({ navigation }) {
// // // //   const [step, setStep] = useState('input');
// // // //   const [moments, setMoments] = useState([]);
// // // //   const [loadingText, setLoadingText] = useState('');
// // // //   const [finalMemory, setFinalMemory] = useState(null);
// // // //   const [pdfLoading, setPdfLoading] = useState(false);
// // // //   const fadeAnim = useRef(new Animated.Value(0)).current;

// // // //   const addPhoto = async () => {
// // // //     if (moments.length >= 6) return Alert.alert("Limit Reached", "Maximum 6 moments allowed.");
// // // //     try {
// // // //       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// // // //       if (status === 'denied') return Alert.alert("Permission Denied", "Please enable Gallery access in Settings.");
// // // //       if (status !== 'granted') return Alert.alert("Permission Needed", "Gallery access is required.");
      
// // // //       const result = await ImagePicker.launchImageLibraryAsync({
// // // //         mediaTypes: ['images'],
// // // //         quality: 0.6,
// // // //         base64: true,
// // // //         allowsEditing: false,
// // // //       });

// // // //       if (!result.canceled && result.assets && result.assets[0]) {
// // // //         setMoments(prev => [...prev, {
// // // //           id: Date.now().toString(),
// // // //           uri: result.assets[0].uri,
// // // //           base64: result.assets[0].base64,
// // // //           note: ''
// // // //         }]);
// // // //       }
// // // //     } catch (error) {
// // // //       Alert.alert("Error", `Failed to open gallery: ${error.message}`);
// // // //     }
// // // //   };

// // // //   const removePhoto = (id) => setMoments(prev => prev.filter(m => m.id !== id));
// // // //   const updateNote = (id, text) => setMoments(prev => prev.map(m => m.id === id ? { ...m, note: text } : m));

// // // //   const generateMemory = async () => {
// // // //     if (moments.length < 2) return Alert.alert("Need More", "Add at least 2 photos.");
// // // //     if (moments.some(m => m.note.trim() === '')) return Alert.alert("Add Details", "Write a note for every photo.");

// // // //     setStep('loading');
// // // //     setLoadingText('📸 Analyzing your travel moments...');

// // // //     try {
// // // //       setLoadingText('🧠 Reading your personal notes...');
// // // //       const payload = moments.map(m => ({ image_base64: m.base64, user_note: m.note }));

// // // //       const response = await fetch(`${SERVER_URL}/api/travel-memory-builder`, {
// // // //         method: 'POST',
// // // //         headers: { 'Content-Type': 'application/json' },
// // // //         body: JSON.stringify({ moments: payload }),
// // // //       });

// // // //       const data = await response.json();
// // // //       if (!data.success) throw new Error(data.error);

// // // //       setLoadingText('✨ Writing your travel story...');
// // // //       await new Promise(resolve => setTimeout(resolve, 1500));

// // // //       setFinalMemory(data.data);
// // // //       setStep('result');
// // // //       Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
// // // //     } catch (err) {
// // // //       Alert.alert("Error", err.message);
// // // //       setStep('input');
// // // //     }
// // // //   };

// // // //   // ======================== PDF GENERATOR ========================
// // // //   const downloadPdf = async () => {
// // // //     if (!finalMemory || pdfLoading) return;
// // // //     setPdfLoading(true);

// // // //     try {
// // // //       // Build timeline HTML with base64 images
// // // //       let timelineHtml = '';
// // // //       finalMemory.timeline.forEach((item, index) => {
// // // //         const imgBase64 = moments[index]?.base64 || '';
// // // //         timelineHtml += `
// // // //           <div style="margin-bottom: 30px; page-break-inside: avoid;">
// // // //             <img src="data:image/jpeg;base64,${imgBase64}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 12px; margin-bottom: 15px;" />
// // // //             <div style="background: #f0f4ff; padding: 15px; border-radius: 10px; border-left: 4px solid #667eea;">
// // // //               <p style="margin: 0 0 5px 0; font-size: 14px; color: #666; font-style: italic;">💡 "${item.user_note}"</p>
// // // //               <p style="margin: 0; font-size: 16px; color: #333; font-weight: 600; line-height: 1.5;">"${item.social_caption}"</p>
// // // //             </div>
// // // //           </div>
// // // //         `;
// // // //       });

// // // //       // Build Tags HTML
// // // //       const tagsHtml = finalMemory.tags?.map(tag => `<span style="background: #eef2ff; color: #667eea; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-right: 5px;">#${tag}</span>`).join('') || '';

// // // //       // Full HTML Document
// // // //       const html = `
// // // //         <!DOCTYPE html>
// // // //         <html lang="en">
// // // //         <head>
// // // //           <meta charset="UTF-8">
// // // //           <style>
// // // //             body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #1a1a2e; line-height: 1.6; background: #fff; }
// // // //             .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
// // // //             h1 { color: #1a1a2e; margin: 0 0 10px 0; font-size: 28px; }
// // // //             .tags { margin-top: 15px; }
// // // //             .story-box { background: #fffdf5; padding: 25px; border-radius: 16px; border: 1px solid #eee; margin-bottom: 40px; }
// // // //             .story-title { color: #667eea; font-size: 14px; text-transform: uppercase; font-weight: bold; margin-bottom: 10px; letter-spacing: 1px; }
// // // //             .story-text { font-size: 17px; color: #444; font-style: italic; margin: 0; }
// // // //             .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #999; }
// // // //           </style>
// // // //         </head>
// // // //         <body>
// // // //           <div class="header">
// // // //             <h1>${finalMemory.trip_title}</h1>
// // // //             <div class="tags">${tagsHtml}</div>
// // // //           </div>
          
// // // //           <div class="story-box">
// // // //             <div class="story-title">Your Travel Story</div>
// // // //             <p class="story-text">${finalMemory.travel_story}</p>
// // // //           </div>

// // // //           <h2 style="color: #1a1a2e; border-bottom: 1px solid #eee; padding-bottom: 10px;">Your Moments</h2>
// // // //           ${timelineHtml}

// // // //           <div class="footer">
// // // //             <p>Generated with ❤️ by TravioX Memory Maker<br>${new Date().toLocaleDateString()}</p>
// // // //           </div>
// // // //         </body>
// // // //         </html>
// // // //       `;

// // // //       // Generate PDF
// // // //       const { uri } = await Print.printToFileAsync({ html, base64: false });
      
// // // //       // Share/Download the file
// // // //       if (Platform.OS === 'ios') {
// // // //         await Sharing.shareAsync(uri, { UTI: 'com.adobe.pdf' });
// // // //       } else {
// // // //         await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
// // // //       }

// // // //     } catch (error) {
// // // //       console.error("PDF Error:", error);
// // // //       Alert.alert("PDF Error", "Could not generate PDF.");
// // // //     } finally {
// // // //       setPdfLoading(false);
// // // //     }
// // // //   };

// // // //   const shareStory = async () => {
// // // //     if (!finalMemory) return;
// // // //     const captions = finalMemory.timeline.map(t => `• ${t.social_caption}`).join('\n');
// // // //     await Share.share({ message: `✈️ ${finalMemory.trip_title}\n\n${finalMemory.travel_story}\n\nCaptions:\n${captions}\n\n#TravioX` });
// // // //   };

// // // //   const renderInput = () => (
// // // //     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
// // // //       <FlatList
// // // //         data={moments} keyExtractor={item => item.id} contentContainerStyle={styles.listContainer}
// // // //         ListHeaderComponent={
// // // //           <>
// // // //             <Text style={styles.mainTitle}>Build Your Trip Memory</Text>
// // // //             <Text style={styles.subtitle}>Add up to 6 photos and write a small detail about each moment.</Text>
// // // //             <TouchableOpacity style={styles.addPhotoBtn} onPress={addPhoto} activeOpacity={0.8}>
// // // //               <LinearGradient colors={['#667eea', '#764ba2']} style={styles.addPhotoGradient}>
// // // //                 <Ionicons name="add-circle-outline" size={24} color="#fff" />
// // // //                 <Text style={styles.addPhotoText}>Add Moment ({moments.length}/6)</Text>
// // // //               </LinearGradient>
// // // //             </TouchableOpacity>
// // // //           </>
// // // //         }
// // // //         ListFooterComponent={moments.length >= 2 ? (
// // // //           <TouchableOpacity style={styles.generateBtn} onPress={generateMemory}>
// // // //             <Text style={styles.generateBtnText}>Generate Travel Story ✨</Text>
// // // //           </TouchableOpacity>
// // // //         ) : null}
// // // //         renderItem={({ item, index }) => (
// // // //           <View style={styles.momentCard}>
// // // //             <Image source={{ uri: item.uri }} style={styles.momentImage} />
// // // //             <View style={styles.momentInputWrapper}>
// // // //               <View style={styles.momentHeader}>
// // // //                 <Text style={styles.momentLabel}>Moment {index + 1}</Text>
// // // //                 <TouchableOpacity onPress={() => removePhoto(item.id)}><Ionicons name="close-circle" size={22} color="#f5576c" /></TouchableOpacity>
// // // //               </View>
// // // //               <TextInput style={styles.momentInput} placeholder="e.g., We ate the best street food here..." placeholderTextColor="#888" multiline value={item.note} onChangeText={(text) => updateNote(item.id, text)} />
// // // //             </View>
// // // //           </View>
// // // //         )}
// // // //       />
// // // //     </KeyboardAvoidingView>
// // // //   );

// // // //   const renderLoading = () => (
// // // //     <View style={styles.loadingContainer}>
// // // //       <ActivityIndicator size="large" color="#667eea" />
// // // //       <Text style={styles.loadingText}>{loadingText}</Text>
// // // //     </View>
// // // //   );

// // // //   const renderResult = () => (
// // // //     <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
// // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // //         <View style={styles.heroSection}>
// // // //           <Text style={styles.heroTitle}>{finalMemory.trip_title}</Text>
// // // //           <View style={styles.tagRow}>
// // // //             {finalMemory.tags?.map((tag, i) => (
// // // //               <View key={i} style={styles.heroTag}><Text style={styles.heroTagText}>#{tag}</Text></View>
// // // //             ))}
// // // //           </View>
// // // //         </View>

// // // //         <View style={styles.storyContainer}>
// // // //           <FontAwesome5 name="feather-alt" size={18} color="#667eea" style={{ marginBottom: 10 }} />
// // // //           <Text style={styles.storyText}>{finalMemory.travel_story}</Text>
// // // //         </View>

// // // //         <View style={styles.timelineContainer}>
// // // //           <Text style={styles.timelineTitle}>Your Moments & Captions</Text>
// // // //           {finalMemory.timeline?.map((item, index) => (
// // // //             <View key={index} style={styles.timelineCard}>
// // // //               <Image source={{ uri: moments[index]?.uri }} style={styles.timelineImage} />
// // // //               <View style={styles.timelineContent}>
// // // //                 <View style={styles.timelineHeader}>
// // // //                   <Text style={styles.timelineEmoji}>{item.mood_emoji}</Text>
// // // //                   <Text style={styles.timelineMood}>{item.mood}</Text>
// // // //                 </View>
// // // //                 <Text style={styles.timelineNote}>💡 "{item.user_note}"</Text>
// // // //                 <View style={styles.captionBox}>
// // // //                   <Text style={styles.captionLabel}>Instagram Caption:</Text>
// // // //                   <Text style={styles.captionText}>{item.social_caption}</Text>
// // // //                   <TouchableOpacity onPress={() => Share.share({ message: item.social_caption })} style={styles.copySmallBtn}>
// // // //                     <Ionicons name="share-social" size={14} color="#667eea" />
// // // //                   </TouchableOpacity>
// // // //                 </View>
// // // //               </View>
// // // //             </View>
// // // //           ))}
// // // //         </View>

// // // //         <View style={styles.resultActions}>
// // // //           {/* NEW PDF BUTTON */}
// // // //           <TouchableOpacity style={styles.pdfBtn} onPress={downloadPdf} disabled={pdfLoading}>
// // // //             <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.shareFullGradient}>
// // // //               {pdfLoading ? (
// // // //                 <ActivityIndicator size="small" color="#fff" />
// // // //               ) : (
// // // //                 <>
// // // //                   <Ionicons name="document-text-outline" size={20} color="#fff" />
// // // //                   <Text style={styles.shareFullText}>Download PDF with Photos</Text>
// // // //                 </>
// // // //               )}
// // // //             </LinearGradient>
// // // //           </TouchableOpacity>

// // // //           <TouchableOpacity style={styles.shareFullBtn} onPress={shareStory}>
// // // //             <LinearGradient colors={['#667eea', '#764ba2']} style={styles.shareFullGradient}>
// // // //               <Ionicons name="share-social-outline" size={20} color="#fff" />
// // // //               <Text style={styles.shareFullText}>Share as Text</Text>
// // // //             </LinearGradient>
// // // //           </TouchableOpacity>

// // // //           <TouchableOpacity style={styles.newTripBtn} onPress={() => { setStep('input'); setMoments([]); setFinalMemory(null); fadeAnim.setValue(0); }}>
// // // //             <Text style={styles.newTripText}>Create New Trip</Text>
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //         <View style={{ height: 50 }} />
// // // //       </ScrollView>
// // // //     </Animated.View>
// // // //   );

// // // //   return (
// // // //     <SafeAreaView style={styles.screen}>
// // // //       <StatusBar barStyle="dark-content" backgroundColor="#f8f9ff" />
// // // //       <View style={styles.header}>
// // // //         <TouchableOpacity onPress={() => step === 'result' ? setStep('input') : navigation.goBack()}>
// // // //           <Ionicons name={step === 'result' ? "arrow-back" : "close"} size={24} color="#333" />
// // // //         </TouchableOpacity>
// // // //         <Text style={styles.headerTitle}>{step === 'input' ? 'Trip Memory' : step === 'loading' ? 'Creating...' : 'Your Story'}</Text>
// // // //         <View style={{ width: 24 }} />
// // // //       </View>
// // // //       {step === 'input' ? renderInput() : step === 'loading' ? renderLoading() : renderResult()}
// // // //     </SafeAreaView>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   screen: { flex: 1, backgroundColor: '#f8f9ff' },
// // // //   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
// // // //   headerTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
// // // //   listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
// // // //   mainTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a2e', marginTop: 10, marginBottom: 8 },
// // // //   subtitle: { fontSize: 15, color: '#888', marginBottom: 24, lineHeight: 22 },
// // // //   addPhotoBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
// // // //   addPhotoGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
// // // //   addPhotoText: { fontSize: 16, fontWeight: '600', color: '#fff' },
// // // //   momentCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eee', flexDirection: 'row' },
// // // //   momentImage: { width: 110, height: 130 },
// // // //   momentInputWrapper: { flex: 1, padding: 12, justifyContent: 'center' },
// // // //   momentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
// // // //   momentLabel: { fontSize: 14, fontWeight: '700', color: '#667eea' },
// // // //   momentInput: { fontSize: 13, color: '#333', minHeight: 60, textAlignVertical: 'top', lineHeight: 18 },
// // // //   generateBtn: { backgroundColor: '#1a1a2e', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 10, marginBottom: 20 },
// // // //   generateBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
// // // //   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// // // //   loadingText: { fontSize: 16, color: '#666', marginTop: 20, fontWeight: '500' },
// // // //   heroSection: { padding: 20, alignItems: 'center' },
// // // //   heroTitle: { fontSize: 28, fontWeight: '800', color: '#1a1a2e', textAlign: 'center', marginBottom: 16, lineHeight: 36 },
// // // //   tagRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
// // // //   heroTag: { backgroundColor: 'rgba(102, 126, 234, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
// // // //   heroTagText: { fontSize: 13, color: '#667eea', fontWeight: '600' },
// // // //   storyContainer: { backgroundColor: '#fff', marginHorizontal: 20, padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#eee', marginBottom: 24 },
// // // //   storyText: { fontSize: 16, color: '#444', lineHeight: 28, fontStyle: 'italic' },
// // // //   timelineContainer: { paddingHorizontal: 20 },
// // // //   timelineTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 16 },
// // // //   timelineCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
// // // //   timelineImage: { width: 100, height: '100%', minHeight: 180 },
// // // //   timelineContent: { flex: 1, padding: 16, justifyContent: 'center' },
// // // //   timelineHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
// // // //   timelineEmoji: { fontSize: 20 },
// // // //   timelineMood: { fontSize: 14, fontWeight: '700', color: '#667eea', textTransform: 'uppercase' },
// // // //   timelineNote: { fontSize: 13, color: '#666', marginBottom: 12, fontStyle: 'italic', lineHeight: 18 },
// // // //   captionBox: { backgroundColor: '#f8f9ff', padding: 12, borderRadius: 12, position: 'relative' },
// // // //   captionLabel: { fontSize: 11, color: '#999', fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
// // // //   captionText: { fontSize: 14, color: '#333', fontWeight: '600', lineHeight: 20, paddingRight: 24 },
// // // //   copySmallBtn: { position: 'absolute', top: 12, right: 12 },
// // // //   resultActions: { paddingHorizontal: 20, paddingVertical: 20, gap: 12 },
// // // //   pdfBtn: { borderRadius: 16, overflow: 'hidden' },
// // // //   shareFullBtn: { borderRadius: 16, overflow: 'hidden' },
// // // //   shareFullGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
// // // //   shareFullText: { fontSize: 16, fontWeight: '600', color: '#fff' },
// // // //   newTripBtn: { paddingVertical: 14, alignItems: 'center' },
// // // //   newTripText: { fontSize: 16, fontWeight: '600', color: '#f5576c' },
// // // // });


















// // // import React, { useState, useRef } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   Image,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   TextInput,
// // //   StyleSheet,
// // //   FlatList,
// // //   Animated,
// // //   Alert,
// // //   ActivityIndicator,
// // //   StatusBar,
// // //   Share,
// // //   KeyboardAvoidingView,
// // //   Platform,
// // // } from 'react-native';

// // // import { LinearGradient } from 'expo-linear-gradient';
// // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // import * as ImagePicker from 'expo-image-picker';
// // // import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
// // // import * as Print from 'expo-print';
// // // import * as Sharing from 'expo-sharing';

// // // const SERVER_URL = 'http://10.90.216.30:3000';

// // // export default function MemoryScreen({ navigation }) {
// // //   const [step, setStep] = useState('input');
// // //   const [moments, setMoments] = useState([]);
// // //   const [loadingText, setLoadingText] = useState('');
// // //   const [finalMemory, setFinalMemory] = useState(null);
// // //   const [pdfLoading, setPdfLoading] = useState(false);
// // //   const fadeAnim = useRef(new Animated.Value(0)).current;

// // //   const addPhoto = async () => {
// // //     if (moments.length >= 6) return Alert.alert("Limit Reached", "Maximum 6 moments allowed.");
// // //     try {
// // //       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// // //       if (status === 'denied') return Alert.alert("Permission Denied", "Please enable Gallery access in Settings.");
// // //       if (status !== 'granted') return Alert.alert("Permission Needed", "Gallery access is required.");
      
// // //       const result = await ImagePicker.launchImageLibraryAsync({
// // //         mediaTypes: ['images'],
// // //         quality: 0.8, // Slightly higher quality for better PDF rendering
// // //         base64: true,
// // //         allowsEditing: false,
// // //       });

// // //       if (!result.canceled && result.assets && result.assets[0]) {
// // //         setMoments(prev => [...prev, {
// // //           id: Date.now().toString(),
// // //           uri: result.assets[0].uri,
// // //           base64: result.assets[0].base64,
// // //           note: ''
// // //         }]);
// // //       }
// // //     } catch (error) {
// // //       Alert.alert("Error", `Failed to open gallery: ${error.message}`);
// // //     }
// // //   };

// // //   const removePhoto = (id) => setMoments(prev => prev.filter(m => m.id !== id));
// // //   const updateNote = (id, text) => setMoments(prev => prev.map(m => m.id === id ? { ...m, note: text } : m));

// // //   const generateMemory = async () => {
// // //     if (moments.length < 2) return Alert.alert("Need More", "Add at least 2 photos.");
// // //     if (moments.some(m => m.note.trim() === '')) return Alert.alert("Add Details", "Write a note for every photo.");

// // //     setStep('loading');
// // //     setLoadingText('📸 Analyzing your travel moments...');

// // //     try {
// // //       setLoadingText('🧠 Reading your personal notes...');
// // //       const payload = moments.map(m => ({ image_base64: m.base64, user_note: m.note }));

// // //       const response = await fetch(`${SERVER_URL}/api/travel-memory-builder`, {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify({ moments: payload }),
// // //       });

// // //       const data = await response.json();
// // //       if (!data.success) throw new Error(data.error);

// // //       setLoadingText('✨ Writing your travel story...');
// // //       await new Promise(resolve => setTimeout(resolve, 1500));

// // //       setFinalMemory(data.data);
// // //       setStep('result');
// // //       Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
// // //     } catch (err) {
// // //       Alert.alert("Error", err.message);
// // //       setStep('input');
// // //     }
// // //   };

// // //   // ======================== PDF GENERATOR (FIXED IMAGES) ========================
// // //   const downloadPdf = async () => {
// // //     if (!finalMemory || pdfLoading) return;
// // //     setPdfLoading(true);

// // //     try {
// // //       // Build timeline HTML with FIXED aspect ratio boxes for images
// // //       let timelineHtml = '';
// // //       finalMemory.timeline.forEach((item, index) => {
// // //         const imgBase64 = moments[index]?.base64 || '';
// // //         timelineHtml += `
// // //           <div style="margin-bottom: 40px; page-break-inside: avoid;">
// // //             <!-- FIX: Wrapper div maintains aspect ratio -->
// // //             <div style="width: 100%; height: 0; padding-bottom: 60%; position: relative; overflow: hidden; border-radius: 12px; margin-bottom: 15px; background-color: #eee;">
// // //               <img src="data:image/jpeg;base64,${imgBase64}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" />
// // //             </div>
// // //             <div style="background: #f0f4ff; padding: 15px; border-radius: 10px; border-left: 4px solid #667eea;">
// // //               <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; font-style: italic;">💡 Your note: "${item.user_note}"</p>
// // //               <p style="margin: 0; font-size: 16px; color: #333; font-weight: 600; line-height: 1.5;">"${item.social_caption}"</p>
// // //             </div>
// // //           </div>
// // //         `;
// // //       });

// // //       const tagsHtml = finalMemory.tags?.map(tag => `<span style="background: #eef2ff; color: #667eea; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-right: 5px; display: inline-block; margin-bottom: 5px;">#${tag}</span>`).join('') || '';

// // //       const html = `
// // //         <!DOCTYPE html>
// // //         <html lang="en">
// // //         <head>
// // //           <meta charset="UTF-8">
// // //           <style>
// // //             body { 
// // //               font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
// // //               padding: 40px 30px; 
// // //               color: #1a1a2e; 
// // //               line-height: 1.6; 
// // //               background: #fff; 
// // //               max-width: 100%;
// // //               box-sizing: border-box;
// // //             }
// // //             .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 25px; }
// // //             h1 { color: #1a1a2e; margin: 0 0 10px 0; font-size: 28px; line-height: 1.3; }
// // //             .story-box { background: #fffdf5; padding: 25px; border-radius: 16px; border: 1px solid #eee; margin-bottom: 40px; }
// // //             .story-title { color: #667eea; font-size: 13px; text-transform: uppercase; font-weight: bold; margin-bottom: 12px; letter-spacing: 1px; }
// // //             .story-text { font-size: 17px; color: #444; font-style: italic; margin: 0; text-align: justify; }
// // //             .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #aaa; border-top: 1px solid #eee; padding-top: 20px; }
// // //           </style>
// // //         </head>
// // //         <body>
// // //           <div class="header">
// // //             <h1>${finalMemory.trip_title}</h1>
// // //             <div class="tags">${tagsHtml}</div>
// // //           </div>
          
// // //           <div class="story-box">
// // //             <div class="story-title">Your Travel Story</div>
// // //             <p class="story-text">${finalMemory.travel_story}</p>
// // //           </div>

// // //           <h2 style="color: #1a1a2e; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Your Moments</h2>
// // //           ${timelineHtml}

// // //           <div class="footer">
// // //             <p>Generated with ❤️ by TravioX<br>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
// // //           </div>
// // //         </body>
// // //         </html>
// // //       `;

// // //       const { uri } = await Print.printToFileAsync({ html, base64: false });
      
// // //       if (Platform.OS === 'ios') {
// // //         await Sharing.shareAsync(uri, { UTI: 'com.adobe.pdf' });
// // //       } else {
// // //         await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
// // //       }

// // //     } catch (error) {
// // //       console.error("PDF Error:", error);
// // //       Alert.alert("PDF Error", "Could not generate PDF.");
// // //     } finally {
// // //       setPdfLoading(false);
// // //     }
// // //   };

// // //   const shareStory = async () => {
// // //     if (!finalMemory) return;
// // //     const captions = finalMemory.timeline.map(t => `• ${t.social_caption}`).join('\n');
// // //     await Share.share({ message: `✈️ ${finalMemory.trip_title}\n\n${finalMemory.travel_story}\n\nCaptions:\n${captions}\n\n#TravioX` });
// // //   };

// // //   const renderInput = () => (
// // //     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
// // //       <FlatList
// // //         data={moments} keyExtractor={item => item.id} contentContainerStyle={styles.listContainer}
// // //         ListHeaderComponent={
// // //           <>
// // //             <Text style={styles.mainTitle}>Build Your Trip Memory</Text>
// // //             <Text style={styles.subtitle}>Add up to 6 photos and write a small detail about each moment.</Text>
// // //             <TouchableOpacity style={styles.addPhotoBtn} onPress={addPhoto} activeOpacity={0.8}>
// // //               <LinearGradient colors={['#667eea', '#764ba2']} style={styles.addPhotoGradient}>
// // //                 <Ionicons name="add-circle-outline" size={24} color="#fff" />
// // //                 <Text style={styles.addPhotoText}>Add Moment ({moments.length}/6)</Text>
// // //               </LinearGradient>
// // //             </TouchableOpacity>
// // //           </>
// // //         }
// // //         ListFooterComponent={moments.length >= 2 ? (
// // //           <TouchableOpacity style={styles.generateBtn} onPress={generateMemory}>
// // //             <Text style={styles.generateBtnText}>Generate Travel Story ✨</Text>
// // //           </TouchableOpacity>
// // //         ) : null}
// // //         renderItem={({ item, index }) => (
// // //           <View style={styles.momentCard}>
// // //             <Image source={{ uri: item.uri }} style={styles.momentImage} />
// // //             <View style={styles.momentInputWrapper}>
// // //               <View style={styles.momentHeader}>
// // //                 <Text style={styles.momentLabel}>Moment {index + 1}</Text>
// // //                 <TouchableOpacity onPress={() => removePhoto(item.id)}><Ionicons name="close-circle" size={22} color="#f5576c" /></TouchableOpacity>
// // //               </View>
// // //               <TextInput style={styles.momentInput} placeholder="e.g., We ate the best street food here..." placeholderTextColor="#888" multiline value={item.note} onChangeText={(text) => updateNote(item.id, text)} />
// // //             </View>
// // //           </View>
// // //         )}
// // //       />
// // //     </KeyboardAvoidingView>
// // //   );

// // //   const renderLoading = () => (
// // //     <View style={styles.loadingContainer}>
// // //       <ActivityIndicator size="large" color="#667eea" />
// // //       <Text style={styles.loadingText}>{loadingText}</Text>
// // //     </View>
// // //   );

// // //   const renderResult = () => (
// // //     <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
// // //       <ScrollView showsVerticalScrollIndicator={false}>
// // //         <View style={styles.heroSection}>
// // //           <Text style={styles.heroTitle}>{finalMemory.trip_title}</Text>
// // //           <View style={styles.tagRow}>
// // //             {finalMemory.tags?.map((tag, i) => (
// // //               <View key={i} style={styles.heroTag}><Text style={styles.heroTagText}>#{tag}</Text></View>
// // //             ))}
// // //           </View>
// // //         </View>

// // //         <View style={styles.storyContainer}>
// // //           <FontAwesome5 name="feather-alt" size={18} color="#667eea" style={{ marginBottom: 10 }} />
// // //           <Text style={styles.storyText}>{finalMemory.travel_story}</Text>
// // //         </View>

// // //         <View style={styles.timelineContainer}>
// // //           <Text style={styles.timelineTitle}>Your Moments & Captions</Text>
// // //           {finalMemory.timeline?.map((item, index) => (
// // //             <View key={index} style={styles.timelineCard}>
// // //               <Image source={{ uri: moments[index]?.uri }} style={styles.timelineImage} />
// // //               <View style={styles.timelineContent}>
// // //                 <View style={styles.timelineHeader}>
// // //                   <Text style={styles.timelineEmoji}>{item.mood_emoji}</Text>
// // //                   <Text style={styles.timelineMood}>{item.mood}</Text>
// // //                 </View>
// // //                 <Text style={styles.timelineNote}>💡 "{item.user_note}"</Text>
// // //                 <View style={styles.captionBox}>
// // //                   <Text style={styles.captionLabel}>Instagram Caption:</Text>
// // //                   <Text style={styles.captionText}>{item.social_caption}</Text>
// // //                   <TouchableOpacity onPress={() => Share.share({ message: item.social_caption })} style={styles.copySmallBtn}>
// // //                     <Ionicons name="share-social" size={14} color="#667eea" />
// // //                   </TouchableOpacity>
// // //                 </View>
// // //               </View>
// // //             </View>
// // //           ))}
// // //         </View>

// // //         <View style={styles.resultActions}>
// // //           <TouchableOpacity style={styles.pdfBtn} onPress={downloadPdf} disabled={pdfLoading}>
// // //             <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.shareFullGradient}>
// // //               {pdfLoading ? (
// // //                 <ActivityIndicator size="small" color="#fff" />
// // //               ) : (
// // //                 <>
// // //                   <Ionicons name="document-text-outline" size={20} color="#fff" />
// // //                   <Text style={styles.shareFullText}>Download PDF with Photos</Text>
// // //                 </>
// // //               )}
// // //             </LinearGradient>
// // //           </TouchableOpacity>

// // //           <TouchableOpacity style={styles.shareFullBtn} onPress={shareStory}>
// // //             <LinearGradient colors={['#667eea', '#764ba2']} style={styles.shareFullGradient}>
// // //               <Ionicons name="share-social-outline" size={20} color="#fff" />
// // //               <Text style={styles.shareFullText}>Share as Text</Text>
// // //             </LinearGradient>
// // //           </TouchableOpacity>

// // //           <TouchableOpacity style={styles.newTripBtn} onPress={() => { setStep('input'); setMoments([]); setFinalMemory(null); fadeAnim.setValue(0); }}>
// // //             <Text style={styles.newTripText}>Create New Trip</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //         <View style={{ height: 50 }} />
// // //       </ScrollView>
// // //     </Animated.View>
// // //   );

// // //   return (
// // //     <SafeAreaView style={styles.screen}>
// // //       <StatusBar barStyle="dark-content" backgroundColor="#f8f9ff" />
// // //       <View style={styles.header}>
// // //         <TouchableOpacity onPress={() => step === 'result' ? setStep('input') : navigation.goBack()}>
// // //           <Ionicons name={step === 'result' ? "arrow-back" : "close"} size={24} color="#333" />
// // //         </TouchableOpacity>
// // //         <Text style={styles.headerTitle}>{step === 'input' ? 'Trip Memory' : step === 'loading' ? 'Creating...' : 'Your Story'}</Text>
// // //         <View style={{ width: 24 }} />
// // //       </View>
// // //       {step === 'input' ? renderInput() : step === 'loading' ? renderLoading() : renderResult()}
// // //     </SafeAreaView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   screen: { flex: 1, backgroundColor: '#f8f9ff' },
// // //   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
// // //   headerTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
// // //   listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
// // //   mainTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a2e', marginTop: 10, marginBottom: 8 },
// // //   subtitle: { fontSize: 15, color: '#888', marginBottom: 24, lineHeight: 22 },
// // //   addPhotoBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
// // //   addPhotoGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
// // //   addPhotoText: { fontSize: 16, fontWeight: '600', color: '#fff' },
// // //   momentCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eee', flexDirection: 'row' },
// // //   momentImage: { width: 110, height: 130 },
// // //   momentInputWrapper: { flex: 1, padding: 12, justifyContent: 'center' },
// // //   momentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
// // //   momentLabel: { fontSize: 14, fontWeight: '700', color: '#667eea' },
// // //   momentInput: { fontSize: 13, color: '#333', minHeight: 60, textAlignVertical: 'top', lineHeight: 18 },
// // //   generateBtn: { backgroundColor: '#1a1a2e', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 10, marginBottom: 20 },
// // //   generateBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
// // //   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// // //   loadingText: { fontSize: 16, color: '#666', marginTop: 20, fontWeight: '500' },
// // //   heroSection: { padding: 20, alignItems: 'center' },
// // //   heroTitle: { fontSize: 28, fontWeight: '800', color: '#1a1a2e', textAlign: 'center', marginBottom: 16, lineHeight: 36 },
// // //   tagRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
// // //   heroTag: { backgroundColor: 'rgba(102, 126, 234, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
// // //   heroTagText: { fontSize: 13, color: '#667eea', fontWeight: '600' },
// // //   storyContainer: { backgroundColor: '#fff', marginHorizontal: 20, padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#eee', marginBottom: 24 },
// // //   storyText: { fontSize: 16, color: '#444', lineHeight: 28, fontStyle: 'italic' },
// // //   timelineContainer: { paddingHorizontal: 20 },
// // //   timelineTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 16 },
// // //   timelineCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
// // //   timelineImage: { width: 100, height: '100%', minHeight: 180 },
// // //   timelineContent: { flex: 1, padding: 16, justifyContent: 'center' },
// // //   timelineHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
// // //   timelineEmoji: { fontSize: 20 },
// // //   timelineMood: { fontSize: 14, fontWeight: '700', color: '#667eea', textTransform: 'uppercase' },
// // //   timelineNote: { fontSize: 13, color: '#666', marginBottom: 12, fontStyle: 'italic', lineHeight: 18 },
// // //   captionBox: { backgroundColor: '#f8f9ff', padding: 12, borderRadius: 12, position: 'relative' },
// // //   captionLabel: { fontSize: 11, color: '#999', fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
// // //   captionText: { fontSize: 14, color: '#333', fontWeight: '600', lineHeight: 20, paddingRight: 24 },
// // //   copySmallBtn: { position: 'absolute', top: 12, right: 12 },
// // //   resultActions: { paddingHorizontal: 20, paddingVertical: 20, gap: 12 },
// // //   pdfBtn: { borderRadius: 16, overflow: 'hidden' },
// // //   shareFullBtn: { borderRadius: 16, overflow: 'hidden' },
// // //   shareFullGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
// // //   shareFullText: { fontSize: 16, fontWeight: '600', color: '#fff' },
// // //   newTripBtn: { paddingVertical: 14, alignItems: 'center' },
// // //   newTripText: { fontSize: 16, fontWeight: '600', color: '#f5576c' },
// // // });








// // // new 4
// // import React, { useState, useRef } from 'react';
// // import {
// //   View, Text, Image, ScrollView, TouchableOpacity, TextInput,
// //   StyleSheet, FlatList, Animated, Alert, ActivityIndicator,
// //   StatusBar, Share, KeyboardAvoidingView, Platform,
// // } from 'react-native';

// // import { LinearGradient } from 'expo-linear-gradient';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import * as ImagePicker from 'expo-image-picker';
// // import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
// // import * as Print from 'expo-print';
// // import * as Sharing from 'expo-sharing';

// // const SERVER_URL = 'http://10.90.216.30:3000';

// // export default function MemoryScreen({ navigation }) {
// //   const [step, setStep] = useState('input');
// //   const [moments, setMoments] = useState([]);
// //   const [loadingText, setLoadingText] = useState('');
// //   const [finalMemory, setFinalMemory] = useState(null);
// //   const [pdfLoading, setPdfLoading] = useState(false);
// //   const fadeAnim = useRef(new Animated.Value(0)).current;

// //   const addPhoto = async () => {
// //     if (moments.length >= 6) return Alert.alert("Limit Reached", "Maximum 6 moments allowed.");
// //     try {
// //       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// //       if (status === 'denied') return Alert.alert("Permission Denied", "Please enable Gallery access in Settings.");
// //       if (status !== 'granted') return Alert.alert("Permission Needed", "Gallery access is required.");
      
// //       const result = await ImagePicker.launchImageLibraryAsync({
// //         mediaTypes: ['images'],
// //         quality: 1, 
// //         base64: true,
// //         allowsEditing: false,
// //       });

// //       if (!result.canceled && result.assets && result.assets[0]) {
// //         setMoments(prev => [...prev, {
// //           id: Date.now().toString(),
// //           uri: result.assets[0].uri,
// //           base64: result.assets[0].base64,
// //           note: ''
// //         }]);
// //       }
// //     } catch (error) {
// //       Alert.alert("Error", `Failed to open gallery: ${error.message}`);
// //     }
// //   };

// //   const removePhoto = (id) => setMoments(prev => prev.filter(m => m.id !== id));
// //   const updateNote = (id, text) => setMoments(prev => prev.map(m => m.id === id ? { ...m, note: text } : m));

// //   const generateMemory = async () => {
// //     if (moments.length < 2) return Alert.alert("Need More", "Add at least 2 photos.");
// //     if (moments.some(m => m.note.trim() === '')) return Alert.alert("Add Details", "Write a note for every photo.");

// //     setStep('loading');
// //     setLoadingText('📸 Analyzing your travel moments...');

// //     try {
// //       setLoadingText('🧠 Reading your personal notes...');
// //       const payload = moments.map(m => ({ image_base64: m.base64, user_note: m.note }));

// //       const response = await fetch(`${SERVER_URL}/api/travel-memory-builder`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ moments: payload }),
// //       });

// //       const data = await response.json();
// //       if (!data.success) throw new Error(data.error);

// //       setLoadingText('✨ Writing your travel story...');
// //       await new Promise(resolve => setTimeout(resolve, 1500));

// //       setFinalMemory(data.data);
// //       setStep('result');
// //       Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
// //     } catch (err) {
// //       Alert.alert("Error", err.message);
// //       setStep('input');
// //     }
// //   };

// //   // ======================== PREMIUM PDF GENERATOR ========================
// //   const downloadPdf = async () => {
// //     if (!finalMemory || pdfLoading) return;
// //     setPdfLoading(true);

// //     try {
// //       const safeTitle = finalMemory.trip_title.replace(/"/g, '&quot;');
// //       const safeStory = finalMemory.travel_story.replace(/\n/g, '<br>').replace(/"/g, '&quot;');
// //       const formattedDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// //       let timelineHtml = '';
      
// //       for (let index = 0; index < finalMemory.timeline.length; index++) {
// //         const item = finalMemory.timeline[index];
        
// //         // ✅ THE FIX: Force a perfect 16:9 crop BEFORE making base64.
// //         // This stops expo-print from squishing the image!
// //         let pdfBase64 = '';
// //         try {
// //           const manipResult = await ImagePicker.manipulateAsync(
// //             moments[index]?.uri,
// //             [{ resize: { width: 800, height: 450 } }], // Forces perfect 16:9 ratio
// //             { base64: true, compress: 0.8 } // Good quality for PDF
// //           );
// //           pdfBase64 = manipResult.base64;
// //         } catch (e) {
// //           pdfBase64 = moments[index]?.base64 || ''; 
// //         }

// //         const safeNote = item.user_note.replace(/"/g, '&quot;');
// //         const safeCaption = item.social_caption.replace(/"/g, '&quot;');

// //         timelineHtml += `
// //           <div style="margin-bottom: 40px; page-break-inside: avoid;">
// //             <div style="padding: 6px; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-radius: 4px; margin-bottom: 20px;">
// //               <!-- Notice: NO fixed height here! Just width: 100%. The 16:9 ratio handles the height naturally -->
// //               <img src="data:image/jpeg;base64,${pdfBase64}" style="width: 100%; display: block; border-radius: 2px;" />
// //             </div>
// //             <div style="padding: 0 8px;">
// //               <p style="margin: 0 0 6px 0; font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold;">Memory ${index + 1}</p>
// //               <p style="margin: 0 0 12px 0; font-size: 14px; color: #555; font-style: italic;">"${safeNote}"</p>
// //               <div style="border-left: 3px solid #667eea; padding-left: 15px; margin-top: 8px;">
// //                 <p style="margin: 0; font-size: 15px; color: #222; line-height: 1.6; font-weight: 500;">${safeCaption}</p>
// //               </div>
// //             </div>
// //           </div>
// //         `;
// //       }

// //       const tagsHtml = finalMemory.tags?.map(tag => `<span style="border: 1px solid #ddd; color: #666; padding: 4px 12px; border-radius: 20px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 4px;">#${tag}</span>`).join('') || '';

// //       const html = `
// //         <!DOCTYPE html>
// //         <html lang="en">
// //         <head>
// //           <meta charset="UTF-8">
// //           <style>
// //             * { box-sizing: border-box; margin: 0; padding: 0; }
// //             body { font-family: 'Georgia', serif; color: #333; line-height: 1.7; background: #fff; }
            
// //             .cover { text-align: center; padding: 60px 40px; border-bottom: 1px solid #eee; margin-bottom: 50px; }
// //             .cover-icon { font-size: 30px; margin-bottom: 20px; }
// //             h1 { font-family: 'Helvetica Neue', sans-serif; font-size: 32px; font-weight: 800; color: #111; margin: 0 0 15px 0; letter-spacing: -0.5px; line-height: 1.2; }
// //             .meta { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
            
// //             .story-container { padding: 0 50px; margin-bottom: 50px; }
// //             .story-header { font-family: 'Helvetica Neue', sans-serif; font-size: 10px; color: #667eea; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
// //             .story-text { font-size: 17px; color: #222; text-align: justify; }
            
// //             .moments-container { padding: 0 50px; }
// //             .moments-title { font-family: 'Helvetica Neue', sans-serif; font-size: 10px; color: #111; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; margin-bottom: 30px; border-bottom: 1px solid #111; padding-bottom: 10px; }
            
// //             .footer { text-align: center; margin-top: 60px; padding: 20px; border-top: 1px solid #eee; font-size: 9px; color: #bbb; text-transform: uppercase; letter-spacing: 1px; }
// //           </style>
// //         </head>
// //         <body>
// //           <div class="cover">
// //             <div class="cover-icon">✈️</div>
// //             <div class="meta">Travel Diary • ${formattedDate}</div>
// //             <h1>${safeTitle}</h1>
// //             <div style="margin-top: 20px;">${tagsHtml}</div>
// //           </div>
          
// //           <div class="story-container">
// //             <div class="story-header">The Story</div>
// //             <p class="story-text">${safeStory}</p>
// //           </div>
          
// //           <div class="moments-container">
// //             <div class="moments-title">The Memories</div>
// //             ${timelineHtml}
// //           </div>
          
// //           <div class="footer">Generated by TravioX Memory Maker</div>
// //         </body>
// //         </html>
// //       `;

// //       const { uri } = await Print.printToFileAsync({ html, base64: false, width: 612, height: 792 });
      
// //       if (Platform.OS === 'ios') {
// //         await Sharing.shareAsync(uri, { UTI: 'com.adobe.pdf' });
// //       } else {
// //         await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
// //       }

// //     } catch (error) {
// //       console.error("PDF Error:", error);
// //       Alert.alert("PDF Error", "Could not generate PDF.");
// //     } finally {
// //       setPdfLoading(false);
// //     }
// //   };

// //   const shareStory = async () => {
// //     if (!finalMemory) return;
// //     const captions = finalMemory.timeline.map(t => `• ${t.social_caption}`).join('\n');
// //     await Share.share({ message: `✈️ ${finalMemory.trip_title}\n\n${finalMemory.travel_story}\n\nCaptions:\n${captions}\n\n#TravioX` });
// //   };

// //   const renderInput = () => (
// //     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
// //       <FlatList
// //         data={moments} keyExtractor={item => item.id} contentContainerStyle={styles.listContainer}
// //         ListHeaderComponent={
// //           <>
// //             <Text style={styles.mainTitle}>Build Your Trip Memory</Text>
// //             <Text style={styles.subtitle}>Add up to 6 photos and write a small detail about each moment.</Text>
// //             <TouchableOpacity style={styles.addPhotoBtn} onPress={addPhoto} activeOpacity={0.8}>
// //               <LinearGradient colors={['#667eea', '#764ba2']} style={styles.addPhotoGradient}>
// //                 <Ionicons name="add-circle-outline" size={24} color="#fff" />
// //                 <Text style={styles.addPhotoText}>Add Moment ({moments.length}/6)</Text>
// //               </LinearGradient>
// //             </TouchableOpacity>
// //           </>
// //         }
// //         ListFooterComponent={moments.length >= 2 ? (
// //           <TouchableOpacity style={styles.generateBtn} onPress={generateMemory}>
// //             <Text style={styles.generateBtnText}>Generate Travel Story ✨</Text>
// //           </TouchableOpacity>
// //         ) : null}
// //         renderItem={({ item, index }) => (
// //           <View style={styles.momentCard}>
// //             <Image source={{ uri: item.uri }} style={styles.momentImage} />
// //             <View style={styles.momentInputWrapper}>
// //               <View style={styles.momentHeader}>
// //                 <Text style={styles.momentLabel}>Moment {index + 1}</Text>
// //                 <TouchableOpacity onPress={() => removePhoto(item.id)}><Ionicons name="close-circle" size={22} color="#f5576c" /></TouchableOpacity>
// //               </View>
// //               <TextInput style={styles.momentInput} placeholder="e.g., We ate the best street food here..." placeholderTextColor="#888" multiline value={item.note} onChangeText={(text) => updateNote(item.id, text)} />
// //             </View>
// //           </View>
// //         )}
// //       />
// //     </KeyboardAvoidingView>
// //   );

// //   const renderLoading = () => (
// //     <View style={styles.loadingContainer}>
// //       <ActivityIndicator size="large" color="#667eea" />
// //       <Text style={styles.loadingText}>{loadingText}</Text>
// //     </View>
// //   );

// //   const renderResult = () => (
// //     <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
// //       <ScrollView showsVerticalScrollIndicator={false}>
// //         <View style={styles.heroSection}>
// //           <Text style={styles.heroTitle}>{finalMemory.trip_title}</Text>
// //           <View style={styles.tagRow}>
// //             {finalMemory.tags?.map((tag, i) => (
// //               <View key={i} style={styles.heroTag}><Text style={styles.heroTagText}>#{tag}</Text></View>
// //             ))}
// //           </View>
// //         </View>
// //         <View style={styles.storyContainer}>
// //           <FontAwesome5 name="feather-alt" size={18} color="#667eea" style={{ marginBottom: 10 }} />
// //           <Text style={styles.storyText}>{finalMemory.travel_story}</Text>
// //         </View>
// //         <View style={styles.timelineContainer}>
// //           <Text style={styles.timelineTitle}>Your Moments & Captions</Text>
// //           {finalMemory.timeline?.map((item, index) => (
// //             <View key={index} style={styles.timelineCard}>
// //               <Image source={{ uri: moments[index]?.uri }} style={styles.timelineImage} />
// //               <View style={styles.timelineContent}>
// //                 <View style={styles.timelineHeader}>
// //                   <Text style={styles.timelineEmoji}>{item.mood_emoji}</Text>
// //                   <Text style={styles.timelineMood}>{item.mood}</Text>
// //                 </View>
// //                 <Text style={styles.timelineNote}>💡 "{item.user_note}"</Text>
// //                 <View style={styles.captionBox}>
// //                   <Text style={styles.captionLabel}>Instagram Caption:</Text>
// //                   <Text style={styles.captionText}>{item.social_caption}</Text>
// //                   <TouchableOpacity onPress={() => Share.share({ message: item.social_caption })} style={styles.copySmallBtn}>
// //                     <Ionicons name="share-social" size={14} color="#667eea" />
// //                   </TouchableOpacity>
// //                 </View>
// //               </View>
// //             </View>
// //           ))}
// //         </View>
// //         <View style={styles.resultActions}>
// //           <TouchableOpacity style={styles.pdfBtn} onPress={downloadPdf} disabled={pdfLoading}>
// //             <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.shareFullGradient}>
// //               {pdfLoading ? <ActivityIndicator size="small" color="#fff" /> : (
// //                 <>
// //                   <Ionicons name="document-text-outline" size={20} color="#fff" />
// //                   <Text style={styles.shareFullText}>Download Premium PDF</Text>
// //                 </>
// //               )}
// //             </LinearGradient>
// //           </TouchableOpacity>
// //           <TouchableOpacity style={styles.shareFullBtn} onPress={shareStory}>
// //             <LinearGradient colors={['#667eea', '#764ba2']} style={styles.shareFullGradient}>
// //               <Ionicons name="share-social-outline" size={20} color="#fff" />
// //               <Text style={styles.shareFullText}>Share as Text</Text>
// //             </LinearGradient>
// //           </TouchableOpacity>
// //           <TouchableOpacity style={styles.newTripBtn} onPress={() => { setStep('input'); setMoments([]); setFinalMemory(null); fadeAnim.setValue(0); }}>
// //             <Text style={styles.newTripText}>Create New Trip</Text>
// //           </TouchableOpacity>
// //         </View>
// //         <View style={{ height: 50 }} />
// //       </ScrollView>
// //     </Animated.View>
// //   );

// //   return (
// //     <SafeAreaView style={styles.screen}>
// //       <StatusBar barStyle="dark-content" backgroundColor="#f8f9ff" />
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => step === 'result' ? setStep('input') : navigation.goBack()}>
// //           <Ionicons name={step === 'result' ? "arrow-back" : "close"} size={24} color="#333" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>{step === 'input' ? 'Trip Memory' : step === 'loading' ? 'Creating...' : 'Your Story'}</Text>
// //         <View style={{ width: 24 }} />
// //       </View>
// //       {step === 'input' ? renderInput() : step === 'loading' ? renderLoading() : renderResult()}
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   screen: { flex: 1, backgroundColor: '#f8f9ff' },
// //   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
// //   headerTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
// //   listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
// //   mainTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a2e', marginTop: 10, marginBottom: 8 },
// //   subtitle: { fontSize: 15, color: '#888', marginBottom: 24, lineHeight: 22 },
// //   addPhotoBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
// //   addPhotoGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
// //   addPhotoText: { fontSize: 16, fontWeight: '600', color: '#fff' },
// //   momentCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eee', flexDirection: 'row' },
// //   momentImage: { width: 110, height: 130 },
// //   momentInputWrapper: { flex: 1, padding: 12, justifyContent: 'center' },
// //   momentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
// //   momentLabel: { fontSize: 14, fontWeight: '700', color: '#667eea' },
// //   momentInput: { fontSize: 13, color: '#333', minHeight: 60, textAlignVertical: 'top', lineHeight: 18 },
// //   generateBtn: { backgroundColor: '#1a1a2e', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 10, marginBottom: 20 },
// //   generateBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
// //   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// //   loadingText: { fontSize: 16, color: '#666', marginTop: 20, fontWeight: '500' },
// //   heroSection: { padding: 20, alignItems: 'center' },
// //   heroTitle: { fontSize: 28, fontWeight: '800', color: '#1a1a2e', textAlign: 'center', marginBottom: 16, lineHeight: 36 },
// //   tagRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
// //   heroTag: { backgroundColor: 'rgba(102, 126, 234, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
// //   heroTagText: { fontSize: 13, color: '#667eea', fontWeight: '600' },
// //   storyContainer: { backgroundColor: '#fff', marginHorizontal: 20, padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#eee', marginBottom: 24 },
// //   storyText: { fontSize: 16, color: '#444', lineHeight: 28, fontStyle: 'italic' },
// //   timelineContainer: { paddingHorizontal: 20 },
// //   timelineTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 16 },
// //   timelineCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
// //   timelineImage: { width: 100, height: '100%', minHeight: 180 },
// //   timelineContent: { flex: 1, padding: 16, justifyContent: 'center' },
// //   timelineHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
// //   timelineEmoji: { fontSize: 20 },
// //   timelineMood: { fontSize: 14, fontWeight: '700', color: '#667eea', textTransform: 'uppercase' },
// //   timelineNote: { fontSize: 13, color: '#666', marginBottom: 12, fontStyle: 'italic', lineHeight: 18 },
// //   captionBox: { backgroundColor: '#f8f9ff', padding: 12, borderRadius: 12, position: 'relative' },
// //   captionLabel: { fontSize: 11, color: '#999', fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
// //   captionText: { fontSize: 14, color: '#333', fontWeight: '600', lineHeight: 20, paddingRight: 24 },
// //   copySmallBtn: { position: 'absolute', top: 12, right: 12 },
// //   resultActions: { paddingHorizontal: 20, paddingVertical: 20, gap: 12 },
// //   pdfBtn: { borderRadius: 16, overflow: 'hidden' },
// //   shareFullBtn: { borderRadius: 16, overflow: 'hidden' },
// //   shareFullGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
// //   shareFullText: { fontSize: 16, fontWeight: '600', color: '#fff' },
// //   newTripBtn: { paddingVertical: 14, alignItems: 'center' },
// //   newTripText: { fontSize: 16, fontWeight: '600', color: '#f5576c' },
// // });















// // new 5
// import React, { useState, useRef } from 'react';
// import {
//   View, Text, Image, ScrollView, TouchableOpacity, TextInput,
//   StyleSheet, FlatList, Animated, Alert, ActivityIndicator,
//   StatusBar, Share, KeyboardAvoidingView, Platform, Linking,
// } from 'react-native';

// import { LinearGradient } from 'expo-linear-gradient';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import * as ImagePicker from 'expo-image-picker';
// import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
// import * as Print from 'expo-print';
// import * as Sharing from 'expo-sharing';

// const SERVER_URL = 'http://10.88.222.30:3000';
// // Your exact Cloudinary Details from your screenshots
// const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dk15xospf/image/upload";

// export default function MemoryScreen({ navigation }) {
//   const [step, setStep] = useState('input');
//   const [moments, setMoments] = useState([]);
//   const [loadingText, setLoadingText] = useState('');
//   const [finalMemory, setFinalMemory] = useState(null);
//   const [pdfLoading, setPdfLoading] = useState(false);
//   const [videoLoading, setVideoLoading] = useState(false);
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   const addPhoto = async () => {
//     if (moments.length >= 6) return Alert.alert("Limit", "Max 6 moments.");
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') return Alert.alert('Permission Needed');
//       const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, base64: true });
//       if (!result.canceled && result.assets?.[0]) {
//         setMoments(prev => [...prev, { id: Date.now().toString(), uri: result.assets[0].uri, base64: result.assets[0].base64, note: '' }]);
//       }
//     } catch (e) { Alert.alert("Error", e.message); }
//   };

//   const removePhoto = (id) => setMoments(prev => prev.filter(m => m.id !== id));
//   const updateNote = (id, text) => setMoments(prev => prev.map(m => m.id === id ? { ...m, note: text } : m));

//   const generateMemory = async () => {
//     if (moments.length < 2) return Alert.alert("Need More", "Add at least 2 photos.");
//     if (moments.some(m => m.note.trim() === '')) return Alert.alert("Add Details", "Write a note for every photo.");
//     setStep('loading');
//     setLoadingText('📸 Analyzing moments...');
//     try {
//       setLoadingText('🧠 Writing story...');
//       const response = await fetch(`${SERVER_URL}/api/travel-memory-builder`, {
//         method: 'POST', headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ moments: moments.map(m => ({ image_base64: m.base64, user_note: m.note })) }),
//       });
//       const data = await response.json();
//       if (!data.success) throw new Error(data.error);
//       setLoadingText('✨ Finalizing...');
//       await new Promise(r => setTimeout(r, 1000));
//       setFinalMemory(data.data);
//       setStep('result');
//       Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
//     } catch (err) { Alert.alert("Error", err.message); setStep('input'); }
//   };

//     // ======================== REAL MP4 VIDEO GENERATION ========================
//    const generateVideo = async () => {
//     if (!finalMemory || videoLoading) return;
//     setVideoLoading(true);
//     Alert.alert("Creating Video", "This takes 1-2 minutes to render...");

//     try {
//       const publicUrls = [];
      
//       // 1. Upload images to Cloudinary
//       for (let i = 0; i < moments.length; i++) {
//         const formData = new FormData();
//         formData.append("file", { uri: moments[i].uri, type: "image/jpeg", name: `image_${i}.jpg` });
//         formData.append("upload_preset", "traviox_unsigned"); 
        
//         const uploadRes = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
//         const uploadData = await uploadRes.json();
//         if (uploadData.secure_url) {
//           publicUrls.push(uploadData.secure_url);
//         } else {
//           throw new Error(`Failed to upload image ${i + 1}`);
//         }
//       }

//       // 2. Extract the small captions from your AI timeline to send to the video
//       const captions = finalMemory.timeline.map(item => item.social_caption);

//       Alert.alert("Rendering...", "Waiting for the video to process (1-2 mins)...");
      
//       const videoRes = await fetch(`${SERVER_URL}/api/generate-video`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           imageUrls: publicUrls, 
//           captions: captions // ✅ Added captions here
//         }),
//       });

//       const videoData = await videoRes.json();
//       if (!videoData.success) throw new Error(videoData.error);

//       if (!videoData.videoUrl) throw new Error("Could not get video URL");

//       // Wait for video to finish processing
//       console.log("⏳ Waiting 60 seconds for video to render...");
//       await new Promise(resolve => setTimeout(resolve, 65000));

//       // 3. Success
//       setVideoLoading(false);
//       Alert.alert("Video Ready! 🎬", "Your travel video is ready.", [
//         { text: "Share Link", onPress: () => Share.share({ message: `Watch my travel video!\n${videoData.videoUrl}` }) },
//         { text: "Open in Browser", onPress: () => Linking.openURL(videoData.videoUrl) },
//         { text: "Cancel", style: "cancel" }
//       ]);

//     } catch (err) {
//       console.error(err);
//       setVideoLoading(false);
//       Alert.alert("Video Error", err.message || "Failed to generate video.");
//     }
//   };
//   // ======================== PREMIUM PDF GENERATOR ========================
//   const downloadPdf = async () => {
//     if (!finalMemory || pdfLoading) return;
//     setPdfLoading(true);
//     try {
//       const safeTitle = finalMemory.trip_title.replace(/"/g, '&quot;');
//       const safeStory = finalMemory.travel_story.replace(/\n/g, '<br>').replace(/"/g, '&quot;');
//       const formattedDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
//       let timelineHtml = '';
//       for (let index = 0; index < finalMemory.timeline.length; index++) {
//         const item = finalMemory.timeline[index];
//         let pdfBase64 = '';
//         try {
//           const manipResult = await ImagePicker.manipulateAsync(moments[index]?.uri, [{ resize: { width: 800, height: 450 } }], { base64: true, compress: 0.8 });
//           pdfBase64 = manipResult.base64;
//         } catch (e) { pdfBase64 = moments[index]?.base64 || ''; }
//         timelineHtml += `<div style="margin-bottom: 40px; page-break-inside: avoid;"><div style="padding: 6px; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-radius: 4px; margin-bottom: 20px;"><img src="data:image/jpeg;base64,${pdfBase64}" style="width: 100%; display: block; border-radius: 2px;" /></div><div style="padding: 0 8px;"><p style="margin: 0 0 12px 0; font-size: 15px; color: #555; font-style: italic;">"${item.user_note.replace(/"/g, '&quot;')}"</p><div style="border-left: 3px solid #667eea; padding-left: 15px;"><p style="margin: 0; font-size: 16px; color: #222; font-weight: 500;">${item.social_caption.replace(/"/g, '&quot;')}</p></div></div></div>`;
//       }
//       const tagsHtml = finalMemory.tags?.map(tag => `<span style="border: 1px solid #ddd; color: #666; padding: 4px 12px; border-radius: 20px; font-size: 10px; text-transform: uppercase; margin-right: 4px;">#${tag}</span>`).join('');
//       const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Georgia',serif;color:#333;line-height:1.7;background:#fff}.cover{text-align:center;padding:60px 40px;border-bottom:1px solid #eee;margin-bottom:50px}h1{font-family:'Helvetica Neue',sans-serif;font-size:32px;font-weight:800;color:#111;margin:0 0 15px 0}.meta{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:2px;margin-bottom:20px}.story-container{padding:0 50px;margin-bottom:50px}.story-header{font-family:'Helvetica Neue',sans-serif;font-size:10px;color:#667eea;text-transform:uppercase;letter-spacing:2px;font-weight:bold;margin-bottom:15px;border-bottom:1px solid #eee;padding-bottom:10px}.story-text{font-size:17px;color:#222;text-align:justify}.moments-container{padding:0 50px}.moments-title{font-family:'Helvetica Neue',sans-serif;font-size:10px;color:#111;text-transform:uppercase;letter-spacing:2px;font-weight:bold;margin-bottom:30px;border-bottom:1px solid #111;padding-bottom:10px}.footer{text-align:center;margin-top:60px;padding:20px;border-top:1px solid #eee;font-size:9px;color:#bbb;text-transform:uppercase}</style></head><body><div class="cover"><div style="font-size:30px;margin-bottom:20px">✈️</div><div class="meta">Travel Diary • ${formattedDate}</div><h1>${safeTitle}</h1><div style="margin-top:20px">${tagsHtml}</div></div><div class="story-container"><div class="story-header">The Story</div><p class="story-text">${safeStory}</p></div><div class="moments-container"><div class="moments-title">The Memories</div>${timelineHtml}</div><div class="footer">Generated by TravioX</div></body></html>`;
      
//       const { uri } = await Print.printToFileAsync({ html, base64: false, width: 612, height: 792 });
//       await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
//     } catch (error) { Alert.alert("PDF Error", error.message); } finally { setPdfLoading(false); }
//   };

//   const shareStory = async () => {
//     if (!finalMemory) return;
//     const captions = finalMemory.timeline.map(t => `• ${t.social_caption}`).join('\n');
//     await Share.share({ message: `✈️ ${finalMemory.trip_title}\n\n${finalMemory.travel_story}\n\n#TravioX` });
//   };

//   // ======================== UI RENDERERS ========================
//   const renderInput = () => (
//     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
//       <FlatList data={moments} keyExtractor={item => item.id} contentContainerStyle={styles.listContainer}
//         ListHeaderComponent={<>
//           <Text style={styles.mainTitle}>Build Your Trip Memory</Text>
//           <Text style={styles.subtitle}>Add photos and details to generate PDF & Video.</Text>
//           <TouchableOpacity style={styles.addPhotoBtn} onPress={addPhoto} activeOpacity={0.8}>
//             <LinearGradient colors={['#667eea', '#764ba2']} style={styles.addPhotoGradient}>
//               <Ionicons name="add-circle-outline" size={24} color="#fff" />
//               <Text style={styles.addPhotoText}>Add Moment ({moments.length}/6)</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </>}
//         ListFooterComponent={moments.length >= 2 ? (
//           <TouchableOpacity style={styles.generateBtn} onPress={generateMemory}>
//             <Text style={styles.generateBtnText}>Generate Travel Story ✨</Text>
//           </TouchableOpacity>
//         ) : null}
//         renderItem={({ item, index }) => (
//           <View style={styles.momentCard}>
//             <Image source={{ uri: item.uri }} style={styles.momentImage} />
//             <View style={styles.momentInputWrapper}>
//               <View style={styles.momentHeader}>
//                 <Text style={styles.momentLabel}>Moment {index + 1}</Text>
//                 <TouchableOpacity onPress={() => removePhoto(item.id)}><Ionicons name="close-circle" size={22} color="#f5576c" /></TouchableOpacity>
//               </View>
//               <TextInput style={styles.momentInput} placeholder="e.g., We ate the best street food here..." placeholderTextColor="#888" multiline value={item.note} onChangeText={(text) => updateNote(item.id, text)} />
//             </View>
//           </View>
//         )}
//       />
//     </KeyboardAvoidingView>
//   );

//   const renderLoading = () => (
//     <View style={styles.loadingContainer}>
//       <ActivityIndicator size="large" color="#667eea" />
//       <Text style={styles.loadingText}>{loadingText}</Text>
//     </View>
//   );

//   const renderResult = () => (
//     <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.heroSection}>
//           <Text style={styles.heroTitle}>{finalMemory.trip_title}</Text>
//           <View style={styles.tagRow}>
//             {finalMemory.tags?.map((tag, i) => (<View key={i} style={styles.heroTag}><Text style={styles.heroTagText}>#{tag}</Text></View>))}
//           </View>
//         </View>
//         <View style={styles.storyContainer}>
//           <FontAwesome5 name="feather-alt" size={18} color="#667eea" style={{ marginBottom: 10 }} />
//           <Text style={styles.storyText}>{finalMemory.travel_story}</Text>
//         </View>
//         <View style={styles.timelineContainer}>
//           <Text style={styles.timelineTitle}>Your Moments & Captions</Text>
//           {finalMemory.timeline?.map((item, index) => (
//             <View key={index} style={styles.timelineCard}>
//               <Image source={{ uri: moments[index]?.uri }} style={styles.timelineImage} />
//               <View style={styles.timelineContent}>
//                 <View style={styles.timelineHeader}>
//                   <Text style={styles.timelineEmoji}>{item.mood_emoji}</Text>
//                   <Text style={styles.timelineMood}>{item.mood}</Text>
//                 </View>
//                 <Text style={styles.timelineNote}>💡 "{item.user_note}"</Text>
//                 <View style={styles.captionBox}>
//                   <Text style={styles.captionLabel}>Caption:</Text>
//                   <Text style={styles.captionText}>{item.social_caption}</Text>
//                 </View>
//               </View>
//             </View>
//           ))}
//         </View>
        
//         {/* ACTION BUTTONS */}
//         <View style={styles.resultActions}>
//           {/* VIDEO BUTTON */}
//           <TouchableOpacity style={styles.actionBtn} onPress={generateVideo} disabled={videoLoading}>
//             <LinearGradient colors={['#f12711', '#f5af19']} style={styles.btnGradient}>
//               {videoLoading ? <ActivityIndicator size="small" color="#fff" /> : (
//                 <><Ionicons name="videocam-outline" size={20} color="#fff" /><Text style={styles.btnText}>Generate MP4 Video</Text></>
//               )}
//             </LinearGradient>
//           </TouchableOpacity>

//           {/* PDF BUTTON */}
//           <TouchableOpacity style={styles.actionBtn} onPress={downloadPdf} disabled={pdfLoading}>
//             <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.btnGradient}>
//               {pdfLoading ? <ActivityIndicator size="small" color="#fff" /> : (
//                 <><Ionicons name="document-text-outline" size={20} color="#fff" /><Text style={styles.btnText}>Download PDF</Text></>
//               )}
//             </LinearGradient>
//           </TouchableOpacity>

//           {/* SHARE TEXT BUTTON */}
//           <TouchableOpacity style={styles.actionBtn} onPress={shareStory}>
//             <LinearGradient colors={['#667eea', '#764ba2']} style={styles.btnGradient}>
//               <Ionicons name="share-social-outline" size={20} color="#fff" />
//               <Text style={styles.btnText}>Share as Text</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.newTripBtn} onPress={() => { setStep('input'); setMoments([]); setFinalMemory(null); fadeAnim.setValue(0); }}>
//             <Text style={styles.newTripText}>Create New Trip</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={{ height: 50 }} />
//       </ScrollView>
//     </Animated.View>
//   );

//   return (
//     <SafeAreaView style={styles.screen}>
//       <StatusBar barStyle="dark-content" backgroundColor="#f8f9ff" />
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => step === 'result' ? setStep('input') : navigation.goBack()}>
//           <Ionicons name={step === 'result' ? "arrow-back" : "close"} size={24} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{step === 'input' ? 'Trip Memory' : step === 'loading' ? 'Creating...' : 'Your Story'}</Text>
//         <View style={{ width: 24 }} />
//       </View>
//       {step === 'input' ? renderInput() : step === 'loading' ? renderLoading() : renderResult()}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: '#f8f9ff' },
//   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
//   headerTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
//   listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
//   mainTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a2e', marginTop: 10, marginBottom: 8 },
//   subtitle: { fontSize: 15, color: '#888', marginBottom: 24, lineHeight: 22 },
//   addPhotoBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
//   addPhotoGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
//   addPhotoText: { fontSize: 16, fontWeight: '600', color: '#fff' },
//   momentCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eee', flexDirection: 'row' },
//   momentImage: { width: 110, height: 130 },
//   momentInputWrapper: { flex: 1, padding: 12, justifyContent: 'center' },
//   momentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
//   momentLabel: { fontSize: 14, fontWeight: '700', color: '#667eea' },
//   momentInput: { fontSize: 13, color: '#333', minHeight: 60, textAlignVertical: 'top', lineHeight: 18 },
//   generateBtn: { backgroundColor: '#1a1a2e', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 10, marginBottom: 20 },
//   generateBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   loadingText: { fontSize: 16, color: '#666', marginTop: 20, fontWeight: '500' },
//   heroSection: { padding: 20, alignItems: 'center' },
//   heroTitle: { fontSize: 28, fontWeight: '800', color: '#1a1a2e', textAlign: 'center', marginBottom: 16, lineHeight: 36 },
//   tagRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
//   heroTag: { backgroundColor: 'rgba(102, 126, 234, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
//   heroTagText: { fontSize: 13, color: '#667eea', fontWeight: '600' },
//   storyContainer: { backgroundColor: '#fff', marginHorizontal: 20, padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#eee', marginBottom: 24 },
//   storyText: { fontSize: 16, color: '#444', lineHeight: 28, fontStyle: 'italic' },
//   timelineContainer: { paddingHorizontal: 20 },
//   timelineTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 16 },
//   timelineCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
//   timelineImage: { width: 100, height: '100%', minHeight: 180 },
//   timelineContent: { flex: 1, padding: 16, justifyContent: 'center' },
//   timelineHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
//   timelineEmoji: { fontSize: 20 },
//   timelineMood: { fontSize: 14, fontWeight: '700', color: '#667eea', textTransform: 'uppercase' },
//   timelineNote: { fontSize: 13, color: '#666', marginBottom: 12, fontStyle: 'italic', lineHeight: 18 },
//   captionBox: { backgroundColor: '#f8f9ff', padding: 12, borderRadius: 12 },
//   captionLabel: { fontSize: 11, color: '#999', fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
//   captionText: { fontSize: 14, color: '#333', fontWeight: '600', lineHeight: 20 },
//   resultActions: { paddingHorizontal: 20, paddingVertical: 20, gap: 12 },
//   actionBtn: { borderRadius: 16, overflow: 'hidden' },
//   btnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
//   btnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
//   newTripBtn: { paddingVertical: 14, alignItems: 'center' },
//   newTripText: { fontSize: 16, fontWeight: '600', color: '#f5576c' },
// });






















// MemoryScreen.js — Dark Mono Theme (matches HomeScreen)
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, FlatList, Animated, Alert, ActivityIndicator,
  StatusBar, Share, KeyboardAvoidingView, Platform, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const SERVER_URL = 'https://semproject-1a4i.vercel.app';
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dk15xospf/image/upload';

/* ═══ Design Tokens (matches HomeScreen) ═══════════════════ */
const T = {
  bg:      '#050505',
  surf:    '#0C0C0C',
  card:    '#131313',
  card2:   '#1A1A1A',
  border:  '#242424',
  border2: '#303030',
  mint:    '#FFFFFF',
  mintL:   '#F0F0F0',
  mintD:   '#C4C4C4',
  purple:  '#909090',
  purpleL: '#B8B8B8',
  pink:    '#505050',
  pinkL:   '#787878',
  gold:    '#FFD97D',
  goldD:   '#E8E8E8',
  sky:     '#D0D0D0',
  t1: '#FFFFFF',
  t2: '#B0B0B0',
  t3: '#4A4A4A',
};

/* ═══ GlowDot (reused from HomeScreen) ════════════════════ */
const GlowDot = ({ color, size = 8, pulseAnim }) => (
  <Animated.View style={{
    width: size, height: size, borderRadius: size / 2,
    backgroundColor: color,
    shadowColor: color, shadowOpacity: 0.9, shadowRadius: 6, elevation: 3,
    transform: [{ scale: pulseAnim }],
  }} />
);

/* ═══ Step Badge ════════════════════════════════════════════ */
const StepBadge = ({ current, total }) => (
  <View style={styles.stepBadge}>
    <Text style={styles.stepBadgeTxt}>{current} / {total}</Text>
  </View>
);

/* ═══ Info Pill ═════════════════════════════════════════════ */
const InfoPill = ({ icon, label, color }) => (
  <View style={[styles.infoPill, { borderColor: color + '40' }]}>
    <Ionicons name={icon} size={11} color={color} />
    <Text style={[styles.infoPillTxt, { color }]}>{label}</Text>
  </View>
);

export default function MemoryScreen({ navigation }) {
  const [step, setStep] = useState('input');
  const [moments, setMoments] = useState([]);
  const [loadingText, setLoadingText] = useState('');
  const [finalMemory, setFinalMemory] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const pulse     = useRef(new Animated.Value(0)).current;
  const spin      = useRef(new Animated.Value(0)).current;
  const float     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 2000, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 7000, useNativeDriver: true })).start();
    Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: 1, duration: 5000, useNativeDriver: true }),
      Animated.timing(float, { toValue: 0, duration: 5000, useNativeDriver: true }),
    ])).start();
  }, []);

  const pulseS  = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.07] });
  const spinStr = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const floatY  = float.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  /* ── Photo Actions ───────────────────────────────────── */
  const addPhoto = async () => {
    if (moments.length >= 6) return Alert.alert('Limit Reached', 'Maximum 6 moments allowed.');
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return Alert.alert('Permission Needed', 'Please allow photo access.');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], quality: 0.8, base64: true,
      });
      if (!result.canceled && result.assets?.[0]) {
        setMoments(prev => [...prev, {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          base64: result.assets[0].base64,
          note: '',
        }]);
      }
    } catch (e) { Alert.alert('Error', e.message); }
  };

  const removePhoto = (id) => setMoments(prev => prev.filter(m => m.id !== id));
  const updateNote  = (id, text) => setMoments(prev => prev.map(m => m.id === id ? { ...m, note: text } : m));

  /* ── Generate Memory ─────────────────────────────────── */
  const generateMemory = async () => {
    if (moments.length < 2) return Alert.alert('Need More', 'Add at least 2 photos.');
    if (moments.some(m => m.note.trim() === '')) return Alert.alert('Add Details', 'Write a note for every photo.');
    setStep('loading');
    setLoadingText('📸 Analyzing moments...');
    try {
      setLoadingText('🧠 Writing your story...');
      const response = await fetch(`${SERVER_URL}/api/travel-memory-builder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moments: moments.map(m => ({ image_base64: m.base64, user_note: m.note })),
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      setLoadingText('✨ Finalizing your memory...');
      await new Promise(r => setTimeout(r, 1000));
      setFinalMemory(data.data);
      setStep('result');
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    } catch (err) {
      Alert.alert('Error', err.message);
      setStep('input');
    }
  };

  /* ── VIDEO — max 4 photos ────────────────────────────── */
  const generateVideo = async () => {
    if (!finalMemory || videoLoading) return;

    // Enforce 4-photo max for video
    const videoMoments = moments.slice(0, 4);
    if (moments.length > 4) {
      Alert.alert(
        'Note',
        'Video supports up to 4 photos. Only the first 4 moments will be used.',
        [{ text: 'Continue', onPress: () => _doGenerateVideo(videoMoments) }, { text: 'Cancel', style: 'cancel' }]
      );
    } else {
      _doGenerateVideo(videoMoments);
    }
  };

  const _doGenerateVideo = async (videoMoments) => {
    setVideoLoading(true);
    Alert.alert('Creating Video', 'This takes 1–2 minutes to render...');
    try {
      const publicUrls = [];
      for (let i = 0; i < videoMoments.length; i++) {
        const formData = new FormData();
        formData.append('file', { uri: videoMoments[i].uri, type: 'image/jpeg', name: `image_${i}.jpg` });
        formData.append('upload_preset', 'traviox_unsigned');
        const uploadRes  = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.secure_url) {
          publicUrls.push(uploadData.secure_url);
        } else {
          throw new Error(`Failed to upload image ${i + 1}`);
        }
      }

      const captions = finalMemory.timeline.slice(0, videoMoments.length).map(item => item.social_caption);
      Alert.alert('Rendering...', 'Waiting for the video to process (1–2 mins)...');

      const videoRes = await fetch(`${SERVER_URL}/api/generate-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrls: publicUrls, captions }),
      });
      const videoData = await videoRes.json();
      if (!videoData.success) throw new Error(videoData.error);
      if (!videoData.videoUrl) throw new Error('Could not get video URL');

      await new Promise(resolve => setTimeout(resolve, 65000));
      setVideoLoading(false);
      Alert.alert('Video Ready! 🎬', 'Your travel video is ready.', [
        { text: 'Share Link', onPress: () => Share.share({ message: `Watch my travel video!\n${videoData.videoUrl}` }) },
        { text: 'Open in Browser', onPress: () => Linking.openURL(videoData.videoUrl) },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } catch (err) {
      setVideoLoading(false);
      Alert.alert('Video Error', err.message || 'Failed to generate video.');
    }
  };


  const shareStory = async () => {
    if (!finalMemory) return;
    await Share.share({
      message: `✈️ ${finalMemory.trip_title}\n\n${finalMemory.travel_story}\n\n#TravioX`,
    });
  };

  /* ══════════════════════════════════════════════════════
     RENDER — INPUT STEP
  ══════════════════════════════════════════════════════ */
  const renderInput = () => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <FlatList
        data={moments}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
            {/* ── Hero Banner ── */}
            <View style={styles.inputHero}>
              <LinearGradient
                colors={['#FFFFFF', '#888888', '#0F0F0F']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.heroBorder}
              >
                <View style={styles.heroCard}>
                  <LinearGradient
                    colors={[T.mint + '20', T.purple + '18', 'transparent']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.heroCardInner}>
                    <View style={styles.orbitWrap}>
                      <Animated.View style={[styles.orbit, { transform: [{ rotate: spinStr }] }]} />
                      <View style={styles.orbitCore}>
                        <MaterialCommunityIcons name="book-open-page-variant" size={24} color={T.gold} />
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.memBadgeRow}>
                        <Animated.View style={[styles.memBadgeDot, { transform: [{ scale: pulseS }] }]} />
                        <Text style={styles.memBadgeTxt}>  MEMORY BUILDER</Text>
                      </View>
                      <Text style={styles.heroTitle}>Build Your{'\n'}Trip Memory</Text>
                      <Text style={styles.heroSub}>Add photos · AI writes your story · Export as Video</Text>
                    </View>
                  </View>
                  {/* Feature pills */}
                  <View style={styles.pillRow}>
                    {[
                              { label: '🎬 4 Photos (Video)', color: '#38EF7D' },
                      { label: '⚡ AI Captions', color: T.mint },
                    ].map(p => (
                      <View key={p.label} style={[styles.featurePill, { borderColor: p.color + '40' }]}>
                        <Text style={[styles.featurePillTxt, { color: p.color }]}>{p.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* ── Add Button ── */}
            <TouchableOpacity
              style={[styles.addPhotoBtn, moments.length >= 6 && { opacity: 0.4 }]}
              onPress={addPhoto}
              activeOpacity={0.8}
              disabled={moments.length >= 6}
            >
              <LinearGradient
                colors={[T.mint + '20', T.border]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.addPhotoGradient}
              >
                <View style={styles.addIconWrap}>
                  <Ionicons name="add" size={20} color={T.mint} />
                </View>
                <Text style={styles.addPhotoText}>Add Moment</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeTxt}>{moments.length}/6</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* ── Video info note ── */}
            {moments.length > 0 && (
              <View style={styles.infoNote}>
                <Ionicons name="information-circle-outline" size={14} color={T.t3} />
                <Text style={styles.infoNoteTxt}>
                  Video uses first 4 photos only
                </Text>
              </View>
            )}
          </>
        }
        ListFooterComponent={
          moments.length >= 2 ? (
            <TouchableOpacity style={styles.generateBtn} onPress={generateMemory} activeOpacity={0.85}>
              <LinearGradient
                colors={['#FFFFFF', '#C4C4C4']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.generateBtnGrad}
              >
                <MaterialCommunityIcons name="lightning-bolt" size={18} color={T.bg} />
                <Text style={styles.generateBtnText}>Generate Travel Story</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item, index }) => (
          <Animated.View style={styles.momentCard}>
            {/* Number badge */}
            <View style={styles.momentNumBadge}>
              <Text style={styles.momentNumTxt}>{index + 1}</Text>
            </View>
            <Image source={{ uri: item.uri }} style={styles.momentImage} />
            <View style={styles.momentInputWrapper}>
              <View style={styles.momentHeader}>
                <View>
                  <Text style={styles.momentLabel}>Moment {index + 1}</Text>
                  {index < 4 && (
                    <View style={styles.videoTagSmall}>
                      <Ionicons name="videocam-outline" size={9} color="#38EF7D" />
                      <Text style={styles.videoTagTxt}>in video</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={() => removePhoto(item.id)} style={styles.removeBtn}>
                  <Ionicons name="close" size={16} color={T.t2} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.momentInput}
                placeholder="e.g., Best street food we had all trip..."
                placeholderTextColor={T.t3}
                multiline
                value={item.note}
                onChangeText={(text) => updateNote(item.id, text)}
              />
            </View>
          </Animated.View>
        )}
      />
    </KeyboardAvoidingView>
  );

  /* ══════════════════════════════════════════════════════
     RENDER — LOADING STEP
  ══════════════════════════════════════════════════════ */
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      {/* Orbit animation */}
      <View style={styles.loadOrbitWrap}>
        <Animated.View style={[styles.loadOrbit, { transform: [{ rotate: spinStr }] }]} />
        <Animated.View style={[styles.loadOrbitInner, { transform: [{ rotate: spinStr }], borderColor: T.gold + '60' }]} />
        <View style={styles.loadOrbitCore}>
          <Text style={{ fontSize: 28 }}>📖</Text>
        </View>
      </View>
      <Text style={styles.loadingTitle}>Creating Your Memory</Text>
      <Text style={styles.loadingText}>{loadingText}</Text>
      <View style={styles.loadDots}>
        {[0, 1, 2].map(i => (
          <Animated.View key={i} style={[styles.loadDot, {
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [i === 0 ? 1 : 0.3, i === 2 ? 1 : 0.3] }),
          }]} />
        ))}
      </View>
    </View>
  );

  /* ══════════════════════════════════════════════════════
     RENDER — RESULT STEP
  ══════════════════════════════════════════════════════ */
  const renderResult = () => (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

        {/* ── Hero Title Block ── */}
        <View style={styles.resultHero}>
          <LinearGradient
            colors={['#FFFFFF', '#888888', '#0F0F0F']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.heroBorder}
          >
            <View style={[styles.heroCard, { padding: 22 }]}>
              <LinearGradient
                colors={[T.mint + '18', T.purple + '14', 'transparent']}
                style={StyleSheet.absoluteFill}
              />
              {/* AI badge */}
              <View style={styles.aiBadge}>
                <GlowDot color={T.mint} size={6} pulseAnim={pulseS} />
                <Text style={styles.aiBadgeTxt}>AI GENERATED · READY</Text>
              </View>
              <Text style={styles.resultTitle}>{finalMemory.trip_title}</Text>
              <View style={styles.tagRow}>
                {finalMemory.tags?.map((tag, i) => (
                  <View key={i} style={styles.resultTag}>
                    <Text style={styles.resultTagTxt}>#{tag}</Text>
                  </View>
                ))}
              </View>
              {/* Stats row */}
              <View style={styles.resultStatsRow}>
                {[
                  { icon: 'images-outline', label: `${moments.length} Photos` },
                  { icon: 'videocam-outline', label: 'Video Ready' },
                ].map((s, i) => (
                  <View key={i} style={styles.resultStat}>
                    <Ionicons name={s.icon} size={13} color={T.t2} />
                    <Text style={styles.resultStatTxt}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* ── Story ── */}
        <View style={styles.storySection}>
          <View style={styles.secRow}>
            <GlowDot color={T.mint} size={6} pulseAnim={pulseS} />
            <Text style={styles.secTitle}> The Story</Text>
          </View>
          <View style={styles.storyCard}>
            <LinearGradient
              colors={[T.mint + '08', 'transparent']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.storyTopAccent} />
            <MaterialCommunityIcons name="format-quote-open" size={28} color={T.t3} style={{ marginBottom: 10 }} />
            <Text style={styles.storyText}>{finalMemory.travel_story}</Text>
          </View>
        </View>

        {/* ── Timeline ── */}
        <View style={styles.timelineSection}>
          <View style={styles.secRow}>
            <GlowDot color={T.gold} size={6} pulseAnim={pulseS} />
            <Text style={styles.secTitle}> Moments & Captions</Text>
          </View>

          {finalMemory.timeline?.map((item, index) => (
            <View key={index} style={styles.timelineCard}>
              {/* Number accent */}
              <View style={styles.timelineNumBadge}>
                <Text style={styles.timelineNumTxt}>{index + 1}</Text>
              </View>
              {index < 4 && (
                <View style={styles.videoChip}>
                  <Ionicons name="videocam-outline" size={9} color="#38EF7D" />
                  <Text style={styles.videoChipTxt}>VIDEO</Text>
                </View>
              )}
              <Image source={{ uri: moments[index]?.uri }} style={styles.timelineImage} />
              <View style={styles.timelineContent}>
                {/* Mood row */}
                <View style={styles.moodRow}>
                  <Text style={styles.moodEmoji}>{item.mood_emoji}</Text>
                  <View style={styles.moodBadge}>
                    <Text style={styles.moodTxt}>{item.mood}</Text>
                  </View>
                </View>
                {/* User note */}
                <View style={styles.noteBox}>
                  <Ionicons name="chatbubble-outline" size={11} color={T.t3} />
                  <Text style={styles.noteTxt}>"{item.user_note}"</Text>
                </View>
                {/* Caption */}
                <View style={styles.captionBox}>
                  <View style={styles.captionTopRow}>
                    <View style={styles.captionLabelDot} />
                    <Text style={styles.captionLabel}>AI CAPTION</Text>
                  </View>
                  <Text style={styles.captionText}>{item.social_caption}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ── Action Buttons ── */}
        <View style={styles.actionsSection}>
          <View style={styles.secRow}>
            <GlowDot color={T.purple} size={6} pulseAnim={pulseS} />
            <Text style={styles.secTitle}> Export</Text>
          </View>

          {/* Video Button */}
          <TouchableOpacity style={styles.actionBtn} onPress={generateVideo} disabled={videoLoading} activeOpacity={0.85}>
            <LinearGradient colors={['#131313', '#1A1A1A']} style={styles.actionBtnInner}>
              <View style={[styles.actionIconWrap, { borderColor: '#F12711' + '50' }]}>
                {videoLoading
                  ? <ActivityIndicator size="small" color="#F12711" />
                  : <Ionicons name="videocam-outline" size={20} color="#F12711" />
                }
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionBtnTitle}>Generate MP4 Video</Text>
                <Text style={styles.actionBtnSub}>First 4 photos · ~1–2 min render</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={T.t3} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Share Text Button */}
          <TouchableOpacity style={styles.actionBtn} onPress={shareStory} activeOpacity={0.85}>
            <LinearGradient colors={['#131313', '#1A1A1A']} style={styles.actionBtnInner}>
              <View style={[styles.actionIconWrap, { borderColor: T.mint + '40' }]}>
                <Ionicons name="share-social-outline" size={20} color={T.mint} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionBtnTitle}>Share as Text</Text>
                <Text style={styles.actionBtnSub}>Copy story + hashtags</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={T.t3} />
            </LinearGradient>
          </TouchableOpacity>

          {/* New Trip */}
          <TouchableOpacity
            style={styles.newTripBtn}
            onPress={() => { setStep('input'); setMoments([]); setFinalMemory(null); fadeAnim.setValue(0); }}
            activeOpacity={0.7}
          >
            <View style={styles.newTripInner}>
              <Ionicons name="add-circle-outline" size={16} color={T.t3} />
              <Text style={styles.newTripText}>Create New Trip</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );

  /* ══════════════════════════════════════════════════════
     MAIN RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={T.bg} />

      {/* Background blobs (matches HomeScreen) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[StyleSheet.absoluteFill, { backgroundColor: T.bg }]} />
        <Animated.View style={[styles.blob, {
          backgroundColor: T.mint + '08', width: 300, height: 300,
          top: -80, right: -60, transform: [{ translateY: floatY }],
        }]} />
        <Animated.View style={[styles.blob, {
          backgroundColor: T.gold + '06', width: 200, height: 200,
          bottom: 200, left: -60, transform: [{ translateY: floatY }],
        }]} />
        <Animated.View style={[styles.decRing, {
          borderColor: T.mint + '10', width: 220, height: 220, borderRadius: 110,
          top: 60, right: -80, transform: [{ translateY: floatY }],
        }]} />
      </View>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackBtn}
          onPress={() => step === 'result' ? (setStep('input'), setMoments([]), setFinalMemory(null), fadeAnim.setValue(0)) : navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={T.t1} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          {step !== 'loading' && (
            <View style={styles.aiBadgeSmall}>
              <GlowDot color={T.mint} size={5} pulseAnim={pulseS} />
              <Text style={styles.aiBadgeSmallTxt}>AI · ACTIVE</Text>
            </View>
          )}
          <Text style={styles.headerTitle}>
            {step === 'input' ? 'Memory Builder' : step === 'loading' ? 'Creating...' : 'Your Story'}
          </Text>
        </View>
        <View style={styles.headerRight}>
          {step === 'input' && moments.length > 0 && (
            <View style={styles.headerCountBadge}>
              <Text style={styles.headerCountTxt}>{moments.length}</Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Gradient underline (matches HomeScreen nameBar) ── */}
      <LinearGradient
        colors={['#FFFFFF', '#444444', 'transparent']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={styles.headerBar}
      />

      {step === 'input' ? renderInput() : step === 'loading' ? renderLoading() : renderResult()}
    </SafeAreaView>
  );
}

/* ═══ Styles ═══════════════════════════════════════════════ */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },

  // BG
  blob:    { position: 'absolute', borderRadius: 9999 },
  decRing: { position: 'absolute', borderWidth: 1 },

  // Header
  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  headerBackBtn:    { width: 38, height: 38, borderRadius: 12, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, justifyContent: 'center', alignItems: 'center' },
  headerCenter:     { flex: 1, alignItems: 'center' },
  headerTitle:      { fontSize: 17, fontWeight: '700', color: T.t1, letterSpacing: -0.3 },
  headerRight:      { width: 38, alignItems: 'flex-end' },
  headerCountBadge: { backgroundColor: T.card, borderWidth: 1, borderColor: T.border2, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  headerCountTxt:   { fontSize: 12, fontWeight: '700', color: T.t2 },
  headerBar:        { height: 2, marginHorizontal: 20, borderRadius: 1, marginBottom: 4 },

  aiBadgeSmall:    { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 },
  aiBadgeSmallTxt: { color: T.mint, fontSize: 9, fontWeight: '800', letterSpacing: 2 },

  // List
  listContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },

  // Input Hero
  inputHero:  { marginBottom: 20 },
  heroBorder: { padding: 1.5, borderRadius: 22 },
  heroCard:   { backgroundColor: T.card, borderRadius: 21, overflow: 'hidden', padding: 18 },
  heroCardInner: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 14 },

  orbitWrap: { width: 56, height: 56, justifyContent: 'center', alignItems: 'center' },
  orbit:     { position: 'absolute', width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, borderColor: T.gold + '50', borderStyle: 'dashed' },
  orbitCore: { width: 44, height: 44, borderRadius: 12, backgroundColor: T.gold + '15', borderWidth: 1, borderColor: T.gold + '40', justifyContent: 'center', alignItems: 'center' },

  memBadgeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,217,125,0.1)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,217,125,0.2)' },
  memBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: T.gold },
  memBadgeTxt: { color: T.gold, fontSize: 8, fontWeight: '900', letterSpacing: 1.5 },

  heroTitle: { color: T.t1, fontSize: 20, fontWeight: '800', letterSpacing: -0.5, lineHeight: 26, marginBottom: 6 },
  heroSub:   { color: T.t3, fontSize: 12, lineHeight: 18 },

  pillRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  featurePill:    { backgroundColor: T.surf, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  featurePillTxt: { fontSize: 11, fontWeight: '600' },

  // Add Button
  addPhotoBtn:     { borderRadius: 16, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: T.border2 },
  addPhotoGradient:{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 12 },
  addIconWrap:     { width: 32, height: 32, borderRadius: 10, backgroundColor: T.mint + '20', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: T.mint + '30' },
  addPhotoText:    { flex: 1, fontSize: 15, fontWeight: '600', color: T.t1 },
  countBadge:      { backgroundColor: T.card2, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: T.border2 },
  countBadgeTxt:   { fontSize: 13, fontWeight: '700', color: T.t2 },

  // Info note
  infoNote:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, paddingHorizontal: 4 },
  infoNoteTxt: { fontSize: 12, color: T.t3, flex: 1 },

  // Moment Card
  momentCard:        { backgroundColor: T.card, borderRadius: 18, marginBottom: 14, overflow: 'hidden', borderWidth: 1, borderColor: T.border, flexDirection: 'row', position: 'relative' },
  momentNumBadge:    { position: 'absolute', top: 10, left: 82, zIndex: 2, width: 22, height: 22, borderRadius: 11, backgroundColor: T.bg, borderWidth: 1, borderColor: T.border2, justifyContent: 'center', alignItems: 'center' },
  momentNumTxt:      { fontSize: 11, fontWeight: '800', color: T.t1 },
  momentImage:       { width: 100, height: 130 },
  momentInputWrapper:{ flex: 1, padding: 12 },
  momentHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  momentLabel:       { fontSize: 13, fontWeight: '700', color: T.t1 },
  videoTagSmall:     { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  videoTagTxt:       { fontSize: 10, color: '#38EF7D', fontWeight: '600' },
  removeBtn:         { width: 28, height: 28, borderRadius: 8, backgroundColor: T.surf, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: T.border },
  momentInput:       { fontSize: 13, color: T.t1, minHeight: 56, textAlignVertical: 'top', lineHeight: 20 },

  // Generate Button
  generateBtn:     { borderRadius: 16, overflow: 'hidden', marginTop: 16, marginBottom: 20 },
  generateBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
  generateBtnText: { fontSize: 16, fontWeight: '800', color: T.bg },

  // Loading
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  loadOrbitWrap:    { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  loadOrbit:        { position: 'absolute', width: 100, height: 100, borderRadius: 50, borderWidth: 1.5, borderColor: T.mint + '30', borderStyle: 'dashed' },
  loadOrbitInner:   { position: 'absolute', width: 72, height: 72, borderRadius: 36, borderWidth: 1, borderStyle: 'dashed' },
  loadOrbitCore:    { width: 56, height: 56, borderRadius: 16, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, justifyContent: 'center', alignItems: 'center' },
  loadingTitle:     { fontSize: 20, fontWeight: '800', color: T.t1, marginBottom: 10 },
  loadingText:      { fontSize: 14, color: T.t2, textAlign: 'center', lineHeight: 22 },
  loadDots:         { flexDirection: 'row', gap: 8, marginTop: 20 },
  loadDot:          { width: 6, height: 6, borderRadius: 3, backgroundColor: T.mint },

  // Result
  resultHero:    { paddingHorizontal: 20, paddingTop: 16, marginBottom: 20 },
  aiBadge:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  aiBadgeTxt:    { color: T.mint, fontSize: 9, fontWeight: '800', letterSpacing: 2 },
  resultTitle:   { fontSize: 24, fontWeight: '900', color: T.t1, letterSpacing: -0.5, marginBottom: 14, lineHeight: 30 },
  tagRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  resultTag:     { backgroundColor: T.mint + '12', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: T.mint + '20' },
  resultTagTxt:  { fontSize: 12, color: T.mintL, fontWeight: '600' },
  resultStatsRow:{ flexDirection: 'row', gap: 14 },
  resultStat:    { flexDirection: 'row', alignItems: 'center', gap: 5 },
  resultStatTxt: { fontSize: 12, color: T.t2, fontWeight: '500' },

  // Story
  storySection: { paddingHorizontal: 20, marginBottom: 24 },
  secRow:       { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  secTitle:     { fontSize: 15, fontWeight: '700', color: T.t1 },
  storyCard:    { backgroundColor: T.card, borderRadius: 20, borderWidth: 1, borderColor: T.border, padding: 20, overflow: 'hidden' },
  storyTopAccent:{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: T.mint + '30' },
  storyText:    { fontSize: 15, color: T.t2, lineHeight: 28, fontStyle: 'italic' },

  // Timeline
  timelineSection:  { paddingHorizontal: 20, marginBottom: 24 },
  timelineCard:     { backgroundColor: T.card, borderRadius: 18, marginBottom: 14, borderWidth: 1, borderColor: T.border, overflow: 'hidden', position: 'relative' },
  timelineNumBadge: { position: 'absolute', top: 12, right: 12, zIndex: 2, width: 24, height: 24, borderRadius: 12, backgroundColor: T.bg, borderWidth: 1, borderColor: T.border2, justifyContent: 'center', alignItems: 'center' },
  timelineNumTxt:   { fontSize: 11, fontWeight: '800', color: T.t1 },
  videoChip:        { position: 'absolute', top: 12, left: 12, zIndex: 2, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: '#38EF7D40' },
  videoChipTxt:     { fontSize: 9, fontWeight: '800', color: '#38EF7D', letterSpacing: 1 },
  timelineImage:    { width: '100%', height: 180 },
  timelineContent:  { padding: 16 },
  moodRow:          { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  moodEmoji:        { fontSize: 20 },
  moodBadge:        { backgroundColor: T.surf, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, borderWidth: 1, borderColor: T.border2 },
  moodTxt:          { fontSize: 11, fontWeight: '700', color: T.t2, textTransform: 'uppercase', letterSpacing: 1 },
  noteBox:          { flexDirection: 'row', gap: 6, alignItems: 'flex-start', marginBottom: 12, backgroundColor: T.surf, padding: 10, borderRadius: 10 },
  noteTxt:          { fontSize: 13, color: T.t3, fontStyle: 'italic', flex: 1, lineHeight: 18 },
  captionBox:       { backgroundColor: T.card2, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: T.border2 },
  captionTopRow:    { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  captionLabelDot:  { width: 5, height: 5, borderRadius: 3, backgroundColor: T.mint },
  captionLabel:     { fontSize: 10, color: T.t3, fontWeight: '700', letterSpacing: 1.5 },
  captionText:      { fontSize: 14, color: T.t1, fontWeight: '600', lineHeight: 22 },

  // Actions
  actionsSection:  { paddingHorizontal: 20, marginBottom: 20 },
  actionBtn:       { borderRadius: 16, overflow: 'hidden', marginBottom: 10, borderWidth: 1, borderColor: T.border },
  actionBtnInner:  { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  actionIconWrap:  { width: 44, height: 44, borderRadius: 12, backgroundColor: T.surf, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  actionBtnTitle:  { fontSize: 15, fontWeight: '700', color: T.t1, marginBottom: 3 },
  actionBtnSub:    { fontSize: 12, color: T.t3 },
  newTripBtn:      { marginTop: 8, alignItems: 'center' },
  newTripInner:    { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14, borderWidth: 1, borderColor: T.border, backgroundColor: T.surf },
  newTripText:     { fontSize: 14, fontWeight: '600', color: T.t3 },

  // Shared
  infoPill:    { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, backgroundColor: T.surf },
  infoPillTxt: { fontSize: 11, fontWeight: '600' },
  stepBadge:   { backgroundColor: T.card, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: T.border2 },
  stepBadgeTxt:{ fontSize: 12, fontWeight: '700', color: T.t2 },
});