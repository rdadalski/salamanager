import { Timestamp } from "firebase/firestore";

export interface IClient {
  id?: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  trainerId: string;
  userId?: string;
  notes?: string;
  status: "active" | "inactive" | "pending";
}

export type CreateClientDto = Pick<
  IClient,
  "name" | "surname" | "email" | "phone" | "notes" | "status"
>;
export type UpdateClientDto = Partial<CreateClientDto>;
