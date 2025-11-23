import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../localization";
import { useNavigation } from "@react-navigation/native";

const TopBar = ({
  title,
  showBack = false,
  onBack,
  rightContent = null,
  leftContent = null,
}) => {
  const { isRTL } = useLanguage();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  const renderLeft = () => {
    if (showBack) {
      return (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isRTL ? "chevron-forward" : "chevron-back"}
            size={24}
            color="#F9F4EF"
          />
        </TouchableOpacity>
      );
    }

    if (leftContent) {
      return <View style={styles.leftCustom}>{leftContent}</View>;
    }

    return <View style={styles.placeholder} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C28E5C" />

      <View style={[styles.content, isRTL && styles.contentRTL]}>
        <View
          style={[styles.titleContainer, isRTL && styles.titleContainerRTL]}
        >
          {renderLeft()}
          <Text style={[styles.title, isRTL && styles.titleRTL]}>{title}</Text>
        </View>

        {rightContent ? (
          <View style={styles.rightContent}>{rightContent}</View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#C28E5C",
    paddingTop: StatusBar.currentHeight || 0,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    height: 57,
    width: "100%",
    // justifyContent: "center",
  },
  contentRTL: {
    flexDirection: "row-reverse",
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: 24,
    height: 24,
  },
  leftCustom: {
    minWidth: 24,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  rightContent: {
    minWidth: 24,
    alignItems: "flex-end",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titleContainerRTL: {
    flexDirection: "row-reverse",
  },
  title: {
    fontFamily: "Cairo_700Bold",
    fontSize: 16,
    color: "#FFF",
    textAlign: "left",
  },
  titleRTL: {
    textAlign: "right",
  },
  reminderButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  reminderText: {
    fontFamily: "Cairo_600SemiBold",
    fontSize: 12,
    color: "#FFF",
  },
});

export default TopBar;
