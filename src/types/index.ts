// A show/play
export type Show = {
  id: string
  title: string
  description: string
  duration: number // in minutes
  image: string // URL or path to image
  dates: string[] // e.g., ["2025-12-25", "2025-12-26"]
  times: string[] // e.g., ["18:00", "20:30"]
}

// Single seat in the theater
export type Seat = {
  row: number
  number: number
  isReserved: boolean
}

// A reservation made by the user
export type Reservation = {
  showId: string
  date: string
  time: string
  seats: Seat[]
  user: User
  totalPrice: number
}

// Basic user info for reservation
export type User = {
  name: string
  email: string
}
