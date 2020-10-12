
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum ProjectStatus {
    Pending = "Pending",
    Progress = "Progress",
    Done = "Done"
}

export enum SprintStatus {
    Pending,
    Progress,
    Finished
}

export enum UserStatus {
    Unactivated = "Unactivated",
    Activated = "Activated",
    Blocked = "Blocked"
}

export enum UserGender {
    Male = "Male",
    Female = "Female",
    Others = "Others"
}

export class InputLogin {
    username: string;
    password: string;
}

export class InputRegister {
    username: string;
    password: string;
    passwordCheck: string;
    fullname?: string;
    isAdmin?: boolean;
    email?: string;
    age?: number;
    gender?: UserGender;
}

export class InputCreateEpic {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    projectId: number;
}

export class InputUpdateEpic {
    epicId: number;
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
}

export class ProjectOption {
    status?: ProjectStatus;
    page?: number;
    limit?: number;
}

export class InputCreateProject {
    name: string;
    description?: string;
    leaderId: number;
    pmId: number;
    memberIds?: number[];
}

export class InputUpdateProject {
    id: number;
    pmId: number;
    name?: string;
    description?: string;
    leaderId: number;
    status?: ProjectStatus;
    memberIds?: number[];
}

export class InputCreateSprint {
    name: string;
    description: string;
    projectId: number;
}

export class InputUpdateSprint {
    sprintId: number;
    name: string;
    description?: string;
}

export class InputUpdateUser {
    level: string;
    skill: string;
    status: UserStatus;
}

export class AccessToken {
    token: string;
}

export abstract class IQuery {
    abstract getPermissionByUserId(userId?: string): Permission[] | Promise<Permission[]>;

    abstract getEpics(projectId?: number): Epic[] | Promise<Epic[]>;

    abstract getEpic(epicId?: number): Epic | Promise<Epic>;

    abstract getProjects(): ProjectData[] | Promise<ProjectData[]>;

    abstract getProject(): Project | Promise<Project>;

    abstract getSprints(projectId?: number): Sprint[] | Promise<Sprint[]>;

    abstract getSprint(epicId?: number): Sprint | Promise<Sprint>;

    abstract getUsers(): User[] | Promise<User[]>;
}

export abstract class IMutation {
    abstract register(userData: InputRegister): User | Promise<User>;

    abstract login(userData: InputLogin): AccessToken | Promise<AccessToken>;

    abstract createEpic(epicData?: InputCreateEpic): Epic | Promise<Epic>;

    abstract updateEpic(epicData?: InputUpdateEpic): Epic | Promise<Epic>;

    abstract deleteEpic(epicId?: number): Epic | Promise<Epic>;

    abstract createProject(projectData?: InputCreateProject): Project | Promise<Project>;

    abstract updateProject(projectData?: InputUpdateProject): Project | Promise<Project>;

    abstract deleteProject(projectId?: number): Project | Promise<Project>;

    abstract createSprint(epicData?: InputCreateSprint): Sprint | Promise<Sprint>;

    abstract updateSprint(epicData?: InputUpdateSprint): Sprint | Promise<Sprint>;

    abstract deleteSprint(epicId?: number): Sprint | Promise<Sprint>;

    abstract updateUser(id?: string, updateInfo?: InputUpdateUser): User | Promise<User>;
}

export class Epic {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    projectId: number;
}

export class Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    entityType?: number;
    pmId?: number;
    leaderId?: number;
    memberIds?: number[];
    members?: User[];
}

export class ProjectData {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    entity_type?: number;
    pm?: User;
    leader?: User;
    members?: User[];
}

export class Sprint {
    id: string;
    name: string;
    description: string;
    startTime?: Date;
    finishTime?: Date;
    projectId: number;
    status: SprintStatus;
    totalStoryPoint: number;
}

export class Role {
    id: string;
    name: string;
    permissions?: Permission[];
}

export class Permission {
    id: string;
    scope: string;
}

export class User {
    id: string;
    username: string;
    fullname?: string;
    roles?: Role[];
    status?: UserStatus;
    email?: string;
    skill?: string;
    level?: string;
    age?: number;
    gender?: UserGender;
}
