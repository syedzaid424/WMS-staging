interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

// broadcasting auth type.
type AuthMessage =
  | { type: "LOGIN"; payload: { user: any; accessToken: string } }
  | { type: "LOGOUT" };


interface SelectInterface {
  label: string,
  value: string | number
}

export type {
  ApiResponse,
  AuthMessage,
  SelectInterface
}
