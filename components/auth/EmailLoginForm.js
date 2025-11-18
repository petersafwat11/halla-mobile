import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailLoginSchema } from "../../utils/schemas/authSchemas";
import { EmailInput, PasswordInput, Button } from "../commen";
import { useTranslation } from "../../localization";
import FormHeader from "./FormHeader";

const EmailLoginForm = ({ onSubmit, loading = false }) => {
  const { t } = useTranslation("auth");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(emailLoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onFormSubmit = async (data) => {
    if (onSubmit) {
      const result = await onSubmit(data);
      // Handle server errors
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
    <View style={styles.container}>
      <FormHeader title={t("login.title")} subtitle={t("login.subtitle")} />

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <EmailInput
              label={t("login.email")}
              placeholder={t("login.emailPlaceholder")}
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
              label={t("login.password")}
              placeholder={t("login.passwordPlaceholder")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              disabled={loading}
              error={errors.password && t(errors.password.message)}
            />
          )}
        />

        <Button
          text={t("login.loginButton")}
          onPress={handleSubmit(onFormSubmit)}
          loading={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  form: {
    width: "100%",
  },
});

export default EmailLoginForm;
