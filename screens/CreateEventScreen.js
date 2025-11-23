import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../localization";
import EventsService from "../services/EventsService";
import { Ionicons } from "@expo/vector-icons";

// Import step components
import StepOne from "../components/createEvent/StepOne";
import StepTwo from "../components/createEvent/StepTwo";
import StepThree from "../components/createEvent/StepThree";
import StepFour from "../components/createEvent/StepFour";
import EventSummary from "../components/createEvent/EventSummary";
import StepHeader from "../components/createEvent/StepHeader";
import PrevAndNextBtns from "../components/createEvent/PrevAndNextBtns";
import PreviewInvitation from "../components/createEvent/PreviewInvitation";

const CreateEventScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigation = useNavigation();
  const { t, isRTL } = useLanguage();

  // Initialize form with default values
  const methods = useForm({
    mode: "onChange",
    defaultValues: EventsService.getDefaultFormValues(),
  });

  const { watch, handleSubmit, setValue } = methods;
  const formData = watch();

  // ============================================================================
  // STEP VALIDATION
  // ============================================================================

  const isStepValid = useMemo(() => {
    return EventsService.validateStepData(currentStep, formData);
  }, [currentStep, formData]);

  // ============================================================================
  // NAVIGATION HANDLERS
  // ============================================================================

  const onNext = useCallback(() => {
    if (!isStepValid) {
      Alert.alert("خطأ", "يرجى إكمال جميع الحقول المطلوبة");
      return;
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission on step 5
      handleSubmit(onSubmit)();
    }
  }, [currentStep, isStepValid, handleSubmit]);

  const onPrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // ============================================================================
  // FORM SUBMISSION
  // ============================================================================

  const onSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true);
      try {
        console.log("Submitting event:", data);

        // TODO: Replace with actual API instance
        // const result = await EventsService.createEvent(data, apiInstance);

        // For now, simulate API call
        const result = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              data: { id: "123", ...data },
              error: null,
            });
          }, 1000);
        });

        if (result.success) {
          Alert.alert("نجح", "تم إنشاء المناسبة بنجاح!", [
            {
              text: "حسناً",
              onPress: () => navigation.navigate("Events"),
            },
          ]);
        } else {
          Alert.alert("خطأ", result.error);
        }
      } catch (error) {
        console.error("Error submitting event:", error);
        Alert.alert("خطأ", "فشل في إنشاء المناسبة. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigation]
  );
  // ============================================================================
  // RENDER STEP CONTENT
  // ============================================================================

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return (
          <StepTwo
            guestList={formData.guestList}
            moderatorsList={formData.moderatorsList}
          />
        );
      case 3:
        return (
          <StepThree
            selectedTemplate={formData.selectedTemplate}
            onSelectTemplate={(template) =>
              setValue("selectedTemplate", template, { shouldValidate: true })
            }
          />
        );
      case 4:
        return <StepFour onPreview={() => setShowPreview(true)} />;
      case 5:
        return <EventSummary />;
      default:
        return null;
    }
  };

  // ============================================================================
  // STEP TITLES AND DESCRIPTIONS
  // ============================================================================

  const getStepInfo = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "تفاصيل المناسبة",
          description: "ادخل تفاصيل المناسبة بشكل صحيح",
        };
      case 2:
        return {
          title: "قائمة الضيوف والمشرفين",
          description: "أضف قائمة الضيوف والمشرفين الخاصة بك",
        };
      case 3:
        return {
          title: "تصميم الدعوة",
          description: "قم بتخصيص القالب ودعوتك بشكل سهل",
        };
      case 4:
        return {
          title: "تصميم الدعوة",
          description: "قم بتخصيص القالب ودعوتك بشكل سهل",
        };
      case 5:
        return {
          title: "مراجعة واطلاق المناسبة",
          description: "راجع كل التفاصيل بتركيز",
        };
      default:
        return { title: "", description: "" };
    }
  };

  const stepInfo = getStepInfo();

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <FormProvider {...methods}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Step Header */}
          <StepHeader
            currentStep={currentStep}
            totalSteps={5}
            title={stepInfo.title}
            description={stepInfo.description}
          />

          {/* Step Content */}
          <View style={styles.contentContainer}>{renderStepContent()}</View>

          {/* Navigation Buttons */}
          <PrevAndNextBtns
            onNext={onNext}
            onPrevious={onPrevious}
            showPrevious={currentStep > 1}
            isNextDisabled={!isStepValid || isSubmitting}
            nextButtonText={currentStep === 5 ? "حفظ" : "التالي"}
            isLoading={isSubmitting}
          />
        </ScrollView>

        {/* Floating Preview Button - Show on Step 4 */}
        {currentStep === 4 && (
          <TouchableOpacity
            style={styles.floatingPreviewButton}
            onPress={() => setShowPreview(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="eye-outline" size={24} color="#FFF" />
            <Text style={styles.floatingPreviewText}>معاينة</Text>
          </TouchableOpacity>
        )}

        {/* Preview Modal */}
        <PreviewInvitation
          visible={showPreview}
          onClose={() => setShowPreview(false)}
          eventTitle={formData.eventName || ""}
          invitationMessage={formData.invitationMessage || ""}
          templateImage={formData.templateImage}
          templateData={{
            brideName: formData.templateBrideName,
            groomName: formData.templateGroomName,
          }}
          eventDate={formData.eventDate}
          eventTime={formData.eventTime}
          location={formData.address?.address || ""}
        />
      </SafeAreaView>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F4EF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 100,
  },
  contentContainer: {
    marginVertical: 24,
  },
  floatingPreviewButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#C28E5C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingPreviewText: {
    fontSize: 16,
    fontFamily: "Cairo_600SemiBold",
    color: "#FFF",
  },
});

export default CreateEventScreen;
