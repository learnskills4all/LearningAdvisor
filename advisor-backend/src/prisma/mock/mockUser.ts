import { Role, User } from '@prisma/client';

// Mock users array
export const userArray = [
  {
    user_id: 1,
    username: 'test_user_name',
    password: '$2b$10$FJY.t/6f8WXgoRCX/tyEfeg.O1x4zWD7q7XcDPn5IiyHtvsG9B9iq',
    created_at: new Date(),
    updated_at: new Date(),
    role: Role.USER,
  },
  {
    user_id: 2,
    username: 'garry_freak_noname',
    password: '$2b$10$FJY.t/6f8WXgoRCX/tyEfeg.O1x4zWD7q7XcDPn5IiyHtvsG9B9iq',
    created_at: new Date(),
    updated_at: new Date(),
    role: Role.USER,
  },
];

// Mock single user
export const aUser = userArray[0];

// Mock a user
export const aFullUser: User = {
  username: 'test_user_name',
  password: '$2b$10$FJY.t/6f8WXgoRCX/tyEfeg.O1x4zWD7q7XcDPn5IiyHtvsG9B9iq',
  user_id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  role: Role.USER,
};

// Mock an Assessor
export const AssessorUser = {
  username: 'test_user_name',
  password: '$2b$10$FJY.t/6f8WXgoRCX/tyEfeg.O1x4zWD7q7XcDPn5IiyHtvsG9B9iq',
  user_id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  role: Role.ASSESSOR,
};

// Mock an Admin
export const AdminUser = {
  username: 'test_user_name',
  password: '$2b$10$FJY.t/6f8WXgoRCX/tyEfeg.O1x4zWD7q7XcDPn5IiyHtvsG9B9iq',
  user_id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  role: Role.ADMIN,
};

// Mock users array
export const userArray1 = [
  {
    user_id: 1,
    username: 'test_username',
    password: 'test_password_hash',
    role: Role.USER,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const updateUserDto = {
  role: Role.USER,
};

export const updateUserDtoAssessor = {
  role: Role.USER,
};

export const updateUserDtoAdmin = {
  role: Role.ADMIN,
};

// Mock single user
export const aUser1 = userArray1[0];

// Mock admin
export const aAdmin = {
  user_id: 1,
  username: 'test_username',
  password: 'test_password_hash',
  role: Role.ADMIN,
  created_at: new Date(),
  updated_at: new Date(),
};

export const mockUser = {
  findMany: jest.fn().mockResolvedValue(userArray),
  findUnique: jest.fn().mockResolvedValue(aUser),
  findFirst: jest.fn().mockResolvedValue(aUser),
  findOne: jest.fn().mockResolvedValue(aUser),
  create: jest.fn().mockResolvedValue(aUser),
  save: jest.fn(),
  update: jest.fn().mockResolvedValue(aUser),
  delete: jest.fn().mockResolvedValue(aUser),
};
