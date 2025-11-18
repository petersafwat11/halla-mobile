import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mobileLoginSchema } from "../../utils/schemas/authSchemas";
import { MobileInput, Button } from "../commen";
import { useTranslation } from "../../localization";
import FormHeader from "./FormHeader";

const MobileLoginForm = ({ onSubmit, loading = false }) => {
  const { t } = useTranslation("auth");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(mobileLoginSchema),
    mode: "onBlur",
    defaultValues: {
      mobile: "",
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
    <View style={styles.container}>
      <FormHeader title={t("login.title")} subtitle={t("login.subtitle")} />

      <View style={styles.form}>
        <Controller
          control={control}
          name="mobile"
          render={({ field: { onChange, onBlur, value } }) => (
            <MobileInput
              label={t("login.mobile")}
              placeholder={t("login.mobilePlaceholder")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              disabled={loading}
              error={errors.mobile && t(errors.mobile.message)}
            />
          )}
        />

        <Button
          text={t("login.sendOTPButton")}
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

export default MobileLoginForm;
