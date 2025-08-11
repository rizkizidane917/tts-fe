import { jwtDecode } from "jwt-decode";

export const decodeJwt = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
