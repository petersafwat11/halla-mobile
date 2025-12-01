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
import EventsService from "../services/EventsService";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../localization";
import { useAuthStore } from "../stores/authStore";
import TopBar from "../components/plans/TopBar";
import YourEventManagedByUsPopup from "../components/createEvent/yourEventManagedByUsPopup";

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
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const navigation = useNavigation();
  const { t } = useLanguage();
  const token = useAuthStore((state) => state.token);

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

        // Check if user is authenticated
        if (!token) {
          Alert.alert("خطأ", "يجب تسجيل الدخول أولاً");
          return;
        }

        // Transform data to API payload format
        const payload = EventsService.transformFormDataToPayload(data);
        console.log("Transformed payload:", payload);

        // Create FormData (backend expects multipart/form-data with JSON strings)
        const formData = new FormData();

        // Add each field as JSON string (matching web version)
        if (payload.guestList) {
          formData.append("guestList", JSON.stringify(payload.guestList));
        }

        if (payload.eventDetails) {
          formData.append("eventDetails", JSON.stringify(payload.eventDetails));
        }

        if (payload.supervisorsList) {
          formData.append(
            "supervisorsList",
            JSON.stringify(payload.supervisorsList)
          );
        }

        if (payload.invitationSettings) {
          // Remove templateImage from invitationSettings (if it's a file)
          const { templateImage, ...restInvitationSettings } =
            payload.invitationSettings;
          formData.append(
            "invitationSettings",
            JSON.stringify(restInvitationSettings)
          );

          // Add templateImage as file if present
          // Note: In mobile, templateImage is usually a URI string, not a File object
          // The backend might need to handle this differently
        }

        if (payload.launchSettings) {
          formData.append(
            "launchSettings",
            JSON.stringify(payload.launchSettings)
          );
        }

        // Make API request with FormData
        const API_BASE_URL =
          "https://labbe-backend-production.up.railway.app/api";
        const response = await fetch(`${API_BASE_URL}/events`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - let fetch set it with boundary for FormData
          },
          body: formData,
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || "Request failed");
        }

        const result = { success: true, data: responseData, error: null };
        console.log("API Response:", result);

        if (result.success) {
          console.log("Event created successfully:", result.data);
          Alert.alert("نجح", "تم إنشاء المناسبة بنجاح!", [
            {
              text: "حسناً",
              onPress: () => {
                // Navigate back to MainTabs, which will show the Events tab
                navigation.navigate("MainTabs", { screen: "Events" });
              },
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
    [navigation, token]
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
  // TOP BAR ACTIONS
  // ============================================================================

  const handleClose = () => {
    Alert.alert(
      "إلغاء إنشاء المناسبة",
      "هل أنت متأكد من إلغاء إنشاء المناسبة؟ سيتم فقدان جميع البيانات.",
      [
        { text: "استمرار", style: "cancel" },
        {
          text: "إلغاء",
          style: "destructive",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleContactUs = () => {
    setShowInfoPopup(false);
    // TODO: Navigate to contact us or open contact method
    Alert.alert("تواصل معنا", "سيتم توجيهك لصفحة التواصل قريباً");
  };

  const topBarRightContent = (
    <TouchableOpacity
      style={styles.infoButton}
      onPress={() => setShowInfoPopup(true)}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={styles.infoIconContainer}>
        <Ionicons name="information" size={20} color="#C28E5C" />
      </View>
    </TouchableOpacity>
  );

  const topBarLeftContent = (
    <TouchableOpacity
      style={styles.closeButton}
      onPress={handleClose}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="close" size={24} color="#F9F4EF" />
    </TouchableOpacity>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <FormProvider {...methods}>
      <SafeAreaView style={styles.container}>
        {/* Top Bar */}
        <TopBar
          title="انشاء مناسبة"
          rightContent={topBarRightContent}
          leftContent={topBarLeftContent}
        />
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
          selectedTemplate={formData.selectedTemplate}
          templateData={{
            brideName: formData.templateBrideName,
            groomName: formData.templateGroomName,
          }}
          eventDate={formData.eventDate}
          eventTime={formData.eventTime}
          location={formData.address?.address || ""}
        />

        {/* Info Popup */}
        <YourEventManagedByUsPopup
          visible={showInfoPopup}
          onClose={() => setShowInfoPopup(false)}
          onContactUs={handleContactUs}
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
  infoButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  infoIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#F9F4EF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F4EF",
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreateEventScreen;
