import React from "react";

import { Container } from "./styles";
import { TextInputProps } from "react-native";

type InputProps = TextInputProps;

export function Input({ ...rest }: InputProps) {
  return <Container {...rest} />;
}
