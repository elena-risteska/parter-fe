export type Show = {
  id: string;
  title: string;
  description: string;
  duration: number;
  image: string;
  date: string;
  time: string;
  totalSeats: number;
  reservedSeats: number;
};

export type Seat = {
  row: number;
  number: number;
  isReserved: boolean;
};

export type Reservation = {
  showId: string;
  date: string;
  time: string;
  seats: Seat[];
  user: User;
  totalPrice: number;
};

export type User = {
  name: string;
  email: string;
};
