import { Role } from '@prisma/client';

// Random start and update date
const myStartDate: any = new Date();
const myEndDate: any = new Date();

// Mock users array
export const userArray = [
  {
    username: 'zipper_parent_instea',
    password: '$2b$10$FJY.t/6f8WXgoRCX/tyEfeg.O1x4zWD7q7XcDPn5IiyHtvsG9B9iq',
    user_id: 1,
    role: Role.USER,
    created_at: myStartDate,
    updated_at: myEndDate,
  },
];

// Mock single user
export const aUser = userArray[0];

// Mock a User dto when logging in
export const userDto = {
  username: 'zipper_parent_instea',
  password: 'f8bd48e4-854a-48eb-86cc-1e1e014cd7e1',
};

// Mock a User registration dto
export const registerDto = {
  role: Role.USER,
};

// Mock individual user 1
export const aFullUser1 = {
  username: 'zipper_parent_instea',
  password: '$2b$10$FJY.t/6f8WXgoRCX/tyEfeg.O1x4zWD7q7XcDPn5IiyHtvsG9B9iq',
  user_id: 1,
  role: Role.USER,
  created_at: myStartDate,
  updated_at: myEndDate,
};

// Mock authentication token dto for login
export const userAuthentication = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InppcHBlcl9wYXJlbnRfaW5zdGVhZCIsImlhdCI6MTY1NDI0ODg5OSwiZXhwIjoxNjU0MjUyNDk5fQ.zYng49r6BXoY0m27RYkAeQZUfbG7Su9iBRqliEylOpU',
  user: aFullUser1,
};

// Mock prisma service
export const mockPrisma = {
  user: {
    findMany: jest.fn().mockResolvedValue(userArray),
    findUnique: jest.fn().mockResolvedValue(aUser),
    findFirst: jest.fn().mockResolvedValue(aUser),
    findOne: jest.fn().mockResolvedValue(aUser),
    create: jest.fn().mockResolvedValue(aUser),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(aUser),
    delete: jest.fn().mockResolvedValue(aUser),
  },
};
