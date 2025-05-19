export interface IResource {
  id?: string;
  name: string;
  defaultPrice: number;
  ownerId: string;
  minTimeBox: string;
  clients?: string[];
}
