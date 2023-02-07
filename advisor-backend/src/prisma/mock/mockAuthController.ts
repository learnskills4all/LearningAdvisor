import { Role } from '@prisma/client';
/*
  For auth.controller
*/

// Random start and update date
const myStartDate: any = new Date();
const myEndDate: any = new Date();

// mock a random user
export const mockUser = {
  username: 'hearing_refused_musical',
  password: 'f894a202-2f5b-4a69-89f7-f7f8f28a9368',
};

// mock a registration dto
export const registerDto = {
  role: Role.ASSESSOR,
};

// mock the information of a user
export const userinfo = {
  user_id: 1,
  username: 'discussion_believed_pleasant',
  role: Role.ASSESSOR,
  created_at: myStartDate,
  updated_at: myEndDate,
  password: '9efd1362-0f70-44df-a32c-b10a8924d826',
};

// mock a user authentication
export const userAuthentication = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV',
  user: userinfo,
};

// mock a successful login
export const mockLogin = {
  msg: 'login successful',
};

// mock a login dto
export const loginDto = {
  username: 'Gerald',
  password: '9efd1362-0f70-44df-a32c-b10a8924d826',
};

// mock a successful logout
export const mockLogout = {
  msg: 'logout successful',
};
