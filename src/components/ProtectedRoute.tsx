import { Navigate } from "react-router-dom"
import { isLoggedIn } from "../utils/auth"
import type { JSX } from "react"

type Props = {
  children: JSX.Element
}

export function ProtectedRoute({ children }: Props) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  return children
}
