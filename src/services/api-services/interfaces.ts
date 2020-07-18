export interface ListResponse<T> {
  total: number;
  data: Array<T>;
}

export type Scope = 'global' | 'client' | 'user';
