import { FC, useEffect, useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import * as Contacts from "expo-contacts";

type ContactType = {
  id: string;
  name: string;
  phoneNumbers?: Array<{
    id: string;
    label: string;
    number: string;
  }>;
};

export const ContactList: FC = () => {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        // Request permission to access contacts
        const { status } = await Contacts.requestPermissionsAsync();

        if (status === "granted") {
          setHasPermission(true);
          setIsLoading(true);

          // Fetch contacts when permission is granted
          const { data } = await Contacts.getContactsAsync({
            fields: [
              Contacts.Fields.ID,
              Contacts.Fields.Name,
              Contacts.Fields.PhoneNumbers,
            ],
            sort: Contacts.SortTypes.FirstName,
          });

          if (data.length > 0) {
            // Transform contacts to our ContactType format
            const formattedContacts = data.map((contact) => ({
              id: contact.id,
              name: contact.name || "Unknown",
              phoneNumbers: contact.phoneNumbers,
            }));
          }
        } else {
          setHasPermission(false);
          Alert.alert(
            "Permission Required",
            "This app needs access to your contacts to proceed. Please grant permission in your device settings.",
            [{ text: "OK" }],
          );
        }
      } catch (error) {
        console.error("Error loading contacts:", error);
        Alert.alert("Error", "Could not load contacts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Contacts Module Example</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
