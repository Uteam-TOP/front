import {IHackathonDto} from "./hackathonDto";
import {IProjectDto} from "./projectDto";
import {resumeVacancyDto} from "./resumeVacancyDto";
import {UserDto} from "./userDto";

export interface IHackathonProject {
  id: number;
  createdAt: number;
  hackathon: IHackathonDto,
  project: IProjectDto,
  hackathonProjectStatus: EHackathonProjectStatus
}

export interface IHackathonMember {
  id: number;
  createdAt: number;
  hackathonId: number,
  hackathonProjectStatus: EHackathonProjectStatus,
  hackathonUserRole: EHackathonUserRole;
  resume: resumeVacancyDto;
  user: UserDto;
}

export interface IHackathonNomination {
  id: number;
  name: string;
  description: string;
  place: number | string;
  hackathonProjectDto: IHackathonProject;
  hackathon: IHackathonDto;
}

export enum EHackathonUserRole {
  Admin  = 'HACKATHON_ADMIN',
  Moderator  = 'HACKATHON_PROJECT_ADMIN',
  User  = 'HACKATHON_USER',
}

export enum EHackathonProjectStatus {
  Submitted = 'SUBMITTED',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Draft = 'DRAFT',
}
