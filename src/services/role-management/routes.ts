import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import * as FAS from "@fortawesome/free-solid-svg-icons";

import CreateAdmin from "../../modules/admin/create-admin";
import AssignmentsContainer from "../../modules/assignments/assignments.container";
import ParentContainer from "../../modules/parent/parent.container";
import SchoolContainer from "../../modules/school/school.container";
import StudentContainer from "../../modules/student/student.container";
import EmailTemplateContainer from "../../modules/email-template/emailTemplate.container";
import TeacherContainer from "../../modules/teacher/teacher.container";
import WIP from "../../shared/components/WIP";
import { Session } from "../../shared/contexts/session";

import { UserRole } from "./roles";

export type Route = {
  component: (props?: any) => JSX.Element;
  name: string;
  url: string;
  sidebar: boolean;
  icon?: IconDefinition;
  userRoles: UserRole[];
};

const routes: Route[] = [
  {
    //   component: WIP,
    //   name: 'Dashboard',
    //   url: '/dashboard',
    //   sidebar: true,
    //   icon: FAS.faTachometerAlt,
    //   userRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PARENT, UserRole.TEACHER, UserRole.STUDENT],
    // }, {
    component: CreateAdmin,
    name: "Create Admin",
    url: "/create-admin",
    sidebar: true,
    icon: FAS.faTachometerAlt,
    userRoles: [UserRole.SUPER_ADMIN],
  },
  {
    component: SchoolContainer,
    name: "School",
    url: "/school",
    sidebar: true,
    icon: FAS.faTachometerAlt,
    userRoles: [UserRole.ADMIN],
  },
  {
    component: TeacherContainer,
    name: "Teacher",
    url: "/teacher",
    sidebar: true,
    icon: FAS.faTachometerAlt,
    userRoles: [UserRole.ADMIN],
  },
  {
    component: ParentContainer,
    name: "Parent",
    url: "/parent",
    sidebar: true,
    icon: FAS.faTachometerAlt,
    userRoles: [UserRole.ADMIN],
  },
  {
    component: AssignmentsContainer,
    name: "Assignments",
    url: "/assignments",
    sidebar: true,
    icon: FAS.faTachometerAlt,
    userRoles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT],
  },
  {
    component: StudentContainer,
    name: "Students",
    url: "/students",
    sidebar: true,
    icon: FAS.faTachometerAlt,
    userRoles: [UserRole.ADMIN],
  },
  {
    component: EmailTemplateContainer,
    name: "Email Templates",
    url: "/emailTemplates",
    sidebar: true,
    icon: FAS.faTachometerAlt,
    userRoles: [UserRole.ADMIN],
  }
];

export function getRoutes({ user }: Session): Route[] {
  if (!user) {
    return [];
  }

  const filteredRoutes = routes.filter((route) =>
    route.userRoles.includes(user.role)
  );

  return filteredRoutes;
}
