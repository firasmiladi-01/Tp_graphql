interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Cv {
  id: number;
  name: string;
  age: number;
  job: string;
  user: number;
}

interface Skill {
  id: number;
  designation: string;
}

interface CvSkillRelation {
  id: number;
  cv: number;
  skill: number;
}

const users: User[] = [
  {
    id: 1,
    name: "User 1",
    email: "user1@example.com",
    role: "admin",
  },
  {
    id: 2,
    name: "User 2",
    email: "user2@example.com",
    role: "user",
  },
  {
    id: 3,
    name: "User 3",
    email: "user3@example.com",
    role: "user",
  },
];

const cvs: Cv[] = [
  {
    id: 1,
    name: "cv1",
    age: 30,
    job: "job1",
    user: 1,
  },
  {
    id: 2,
    name: "cv2",
    age: 31,
    job: "job2",
    user: 2,
  },
  {
    id: 3,
    name: "cv3",
    age: 32,
    job: "job3",
    user: 3,
  },
  {
    id: 4,
    name: "cv4",
    age: 33,
    job: "job4",
    user: 3,
  },
];

const skills: Skill[] = [
  {
    id: 1,
    designation: "d1",
  },
  {
    id: 2,
    designation: "d2",
  },
];

const cv_skill_relations: CvSkillRelation[] = [
  {
    id: 2,
    cv: 1,
    skill: 2,
  },
  {
    id: 1,
    cv: 1,
    skill: 1,
  },
  {
    id: 3,
    cv: 2,
    skill: 1,
  },
  {
    id: 5,
    cv: 4,
    skill: 1,
  },
];

export const db = {
  users,
  cvs,
  skills,
  cv_skill_relations,
};

export type Db = typeof db;