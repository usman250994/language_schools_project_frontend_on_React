export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

export const UserRoleText: { [x in UserRole]: string } = {
  ADMIN: 'Super Admin',
  CLIENT: 'Client User',
};

export enum ClientRole {
  ADMIN = 'ADMIN',
  ANALYST = 'ANALYST',
  VETTER = 'VETTER',
}

export const ClientRoleText: { [x in ClientRole]: string } = {
  ADMIN: 'Administrator',
  ANALYST: 'Analyst',
  VETTER: 'Vetter',
};
