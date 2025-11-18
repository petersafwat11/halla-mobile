import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { completeProfileSchema } from "../../utils/schemas/authSchemas";
import { TextInput, EmailInput, PasswordInput, Button } from "../commen";
import { useTranslation, useLanguage } from "../../localization";
import FormHeader from "./FormHeader";

const CompleteProfileForm = ({ onSubmit, loading = false }) => {
  const { t } = useTranslation("auth");
  const { isRTL } = useLanguage();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(completeProfileSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onFormSubmit = async (data) => {
    if (onSubmit) {
      const result = await onSubmit(data);
      if (result && !result.success && result.fieldErrors) {
        Object.keys(result.fieldErrors).forEach((field) => {
          setError(field, {
            type: "server",
            message: result.fieldErrors[field],
          });
        });
      }
    }
  };

  return (
    <View style={[styles.container, isRTL && styles.containerRTL]}>
      <FormHeader
        title={t("signup.completeProfileTitle")}
        subtitle={t("signup.completeProfileSubtitle")}
      />

      <View style={[styles.form, isRTL && styles.formRTL]}>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={t("signup.fullName")}
              placeholder={t("signup.fullNamePlaceholder")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              disabled={loading}
              error={errors.fullName && t(errors.fullName.message)}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <EmailInput
              label={t("signup.email")}
              placeholder={t("signup.emailPlaceholder")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              disabled={loading}
              error={errors.email && t(errors.email.message)}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              label={t("signup.password")}
              placeholder={t("signup.passwordPlaceholder")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              disabled={loading}
              error={errors.password && t(errors.password.message)}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              label={t("signup.confirmPassword")}
              placeholder={t("signup.confirmPasswordPlaceholder")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              disabled={loading}
              error={
                errors.confirmPassword && t(errors.confirmPassword.message)
              }
            />
          )}
        />
        <View style={styles.buttonContainer}>
        <Button
          text={t("signup.completeButton")}
          onPress={handleSubmit(onFormSubmit)}
          loading={loading}
        />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "flex-start",
  },
  containerRTL: {
    alignItems: "flex-start",
  },
  form: {
    width: "100%",
    alignItems: "flex-start",
  },
  formRTL: {
    alignItems: "flex-start",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 16,
  },
});

export default CompleteProfileForm;
