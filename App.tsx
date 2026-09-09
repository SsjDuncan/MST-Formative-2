import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {

  //my standard imports for react native (the skeleton of the app)
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';

// 1.makes sure the
// dish will always save with the correct data types and properties
interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: string;
  price: string;
}

// 2. Tracks if there are any missing items or errors
interface FormErrors {
  dishName?: string;
  description?: string;
  course?: string;
  price?: string;
}

export default function App() {
  //  Form Input States 
  //To track what the chef types
  const [dishName, setDishName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  //    Array menuitems will store the dishes added
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  //  UX Feedback & Message Handlers correct 
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  // checks if fields are valid before submission & adds the new dish to the menuItems array
  // if there are errors, it will set the errors state and display them to the user
  const handleAddMenuItem = () => {
    let currentErrors: FormErrors = {};

    if (!dishName.trim()) currentErrors.dishName = 'Dish Name is required.';
    if (!description.trim()) currentErrors.description = 'Description is required.';
    if (!course.trim()) currentErrors.course = 'Course category is required.';
    
    if (!price.trim()) {
      currentErrors.price = 'Price is required.';
    } else if (isNaN(Number(price)) || parseFloat(price) <= 0) {
      currentErrors.price = 'Please enter a valid positive price amount.';
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      setSuccessMessage('');
      return;
    }

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: dishName.trim(),
      description: description.trim(),
      course: course.trim(),
      price: parseFloat(price).toFixed(2),
    };

    setErrors({});
    setMenuItems((prevItems) => [...prevItems, newItem]);
    setSuccessMessage(`"${newItem.name}" successfully added to the menu!`);

    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');

    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  // to insure it can scroll on smaller devices and avoid the keyboard overlapping the input fields
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardContainer}
      >

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          {/* Brand Header Display Area */}
          <View style={styles.header}>
            <View style={styles.imageLockWrapper}>
              {/* to display the restaurant logo properly */}
              <Image 
                source={require('./assets/restaurant.png')} 
                style={styles.logoImage} 
                resizeMode="center"
              />
            </View>
            <Text style={styles.headerTitle}>CHRISTOFFEL'S MENU MANAGER</Text>
            <Text style={styles.headerSubtitle}>Restaurant Setup</Text>
          </View>
          
          {/* to create the form for adding new menu items */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Capture New Dish Details</Text>

            {successMessage ? (
              <View style={styles.successAlert}>
                <Text style={styles.successAlertText}>{successMessage}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dish Name</Text>
              <TextInput
                style={[styles.input, errors.dishName && styles.inputErrorBorder]}
                placeholder="e.g., Prego Roll"
                placeholderTextColor="#94A3B8"
                value={dishName}
                onChangeText={setDishName}
              />
              {errors.dishName && <Text style={styles.errorText}>{errors.dishName}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, errors.description && styles.inputErrorBorder]}
                placeholder="Describe ingredients, flavor profiles, or allergens..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={3}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Course Category</Text>
              <TextInput
                style={[styles.input, errors.course && styles.inputErrorBorder]}
                placeholder="e.g., Starters, Mains, Desserts"
                placeholderTextColor="#94A3B8"
                value={course}
                onChangeText={setCourse}
                />
              {errors.course && <Text style={styles.errorText}>{errors.course}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price (South African Rand - ZAR)</Text>
              <TextInput
                style={[styles.input, errors.price && styles.inputErrorBorder]}
                placeholder="e.g., 200"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAddMenuItem} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Add to Menu</Text>
            </TouchableOpacity>
          </View>

          {/* stores the menu items */}
          <View style={styles.directoryContainer}>
            <Text style={styles.sectionTitle}>
              Current Menu Directory ({menuItems.length} Dishes Total)
            </Text>

            {menuItems.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No menu items have been added yet.</Text>
                <Text style={styles.emptySubtext}>Use the form below to populate the chef's directory.</Text>
              </View>
            ) : (
              menuItems.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardTag}>{item.course}</Text>
                  </View>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                  <Text style={styles.cardPrice}>R {item.price}</Text>
                </View>
              ))
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// styles for the app, including colors, spacing, and layout
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#1A1E29', 
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 60,
  },
  header: {
    backgroundColor: '#1E2330', 
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2D3548',
    width: '100%',
  },
  imageLockWrapper: {
    width: 320,
    height: 320,
    maxWidth: 320,
    maxHeight: 320,
    overflow: 'hidden',
    marginBottom: 12,
  },
  logoImage: {
    width: 320,
    height: 320,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'crimson',
    marginTop: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#242B3D', 
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginHorizontal: 16,
    borderColor: '#2D3548',
    borderWidth: 1,
  },
  directoryContainer: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#38435C',
    paddingBottom: 8,
    letterSpacing: 0.3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1E2330', 
    borderWidth: 1,
    borderColor: '#38435C',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: 'White', 
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputErrorBorder: {
    borderColor: 'red',
    backgroundColor: '#321E26',
  },
  successAlert: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  successAlertText: {
    color: 'White',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  errorText: {
    color: '#F43F5E',
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#242B3D',
    borderRadius: 12,
    borderColor: '#2D3548',
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#5A6B85',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#242B3D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderColor: '#2D3548',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'White',
  },
  cardTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    backgroundColor: '#1A2E27',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 8,
  },
    cardPrice: {
      fontSize: 14,
      fontWeight: '700',
      color: '#10B981',
    },
  });