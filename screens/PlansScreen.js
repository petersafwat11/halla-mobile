import React, { useState } from "react";
import { View, StyleSheet, StatusBar, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PlansOverview from "../components/plans/PlansOverview";
import AddionalFeatures from "../components/plans/AddionalFeatures";
import PaymentSummery from "../components/plans/PaymentSummery";
import TopBar from "../components/plans/TopBar";

const PlansScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [additionalFeatures, setAdditionalFeatures] = useState([]);

  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const animateTransition = (callback) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(callback, 150);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    animateTransition(() => {
      setCurrentStep(2);
    });
  };

  const handleConfirmAdditionalFeatures = (features) => {
    setAdditionalFeatures(features);
    animateTransition(() => {
      setCurrentStep(3);
    });
  };

  const handleConfirmPayment = () => {
    // Here you would typically navigate to payment gateway
    console.log("Processing payment for:", {
      plan: selectedPlan,
      additionalFeatures,
    });
    // For now, just show an alert or navigate back
    if (navigation) {
      navigation.goBack();
    }
  };

  const handleBack = () => {
    if (currentStep === 1 && navigation) {
      navigation.goBack();
    } else {
      animateTransition(() => {
        if (currentStep > 1) {
          setCurrentStep(currentStep - 1);
        }
      });
    }
  };

  const getTitle = () => {
    switch (currentStep) {
      case 1:
        return "ترقية الباقة";
      case 2:
        return "ترقية الباقة";
      case 3:
        return "اتمام الدفع";
      default:
        return "ترقية الباقة";
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#C28E5C" />

      <TopBar
        title={getTitle()}
        onBack={handleBack}
        showBack={currentStep > 1 || navigation}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {currentStep === 1 && (
          <PlansOverview onSelectPlan={handleSelectPlan} />
        )}

        {currentStep === 2 && (
          <AddionalFeatures
            selectedPlan={selectedPlan}
            onConfirm={handleConfirmAdditionalFeatures}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <PaymentSummery
            selectedPlan={selectedPlan}
            additionalFeatures={additionalFeatures}
            onConfirm={handleConfirmPayment}
            onBack={handleBack}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C28E5C",
  },
  content: {
    flex: 1,
    backgroundColor: "#F9F4EF",
  },
});

export default PlansScreen;
