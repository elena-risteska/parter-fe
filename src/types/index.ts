// A show/play
export type Show = {
  id: string
  title: string
  description: string
  duration: number
  image: string
  date: string
  time: string
  totalSeats: number
  reservedSeats: number
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
